import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import {
    GraphQLContext,
    RecipeDeletedSubscriptionPayload,
    RecipePopulated,
    RecipeUpdatedSubscriptionPayload,
} from './../../util/types';
import { withFilter } from 'graphql-subscriptions';

const resolvers = {
    Query: {
        recipe: async (
            _: any,
            args: { recipeId: string },
            context: GraphQLContext
        ) => {
            const { session, prisma } = context;
            const { recipeId } = args;

            if (!session?.user) {
                throw new GraphQLError('Not authorized');
            }

            try {
                const recipe = await prisma.recipe.findUnique({
                    where: {
                        id: recipeId,
                    },
                    include: recipePopulated,
                });

                if (!recipe) {
                    throw new GraphQLError('Recipe not found');
                }

                return recipe;
            } catch (error) {}
        },
        recipes: async (_: any, __: any, context: GraphQLContext) => {
            const { session, prisma } = context;

            if (!session?.user) {
                throw new GraphQLError('Not authorized');
            }

            const {
                user: { id: userId },
            } = session;

            try {
                const recipes = await prisma.recipe.findMany({
                    include: recipePopulated,
                });

                return recipes;
            } catch (error: any) {
                console.log('recipes error', error);
                throw new GraphQLError(error?.message);
            }
        },
    },
    Mutation: {
        createRecipe: async (
            _: any,
            args: {
                title: string;
                userId: string;
                description: string;
                ingredients: string;
                recipeMethod: string[];
                servings: number;
                time: number;
                link: string;
                categories: string[];
            },
            context: GraphQLContext
        ): Promise<{ recipeId: string }> => {
            const { session, prisma, pubsub } = context;
            const {
                title,
                userId,
                description,
                ingredients,
                recipeMethod,
                servings,
                time,
                link,
                categories,
            } = args;

            if (!session?.user) {
                throw new GraphQLError('Not authorized');
            }

            try {
                const newRecipe = await prisma.recipe.create({
                    data: {
                        name: title,
                        userId,
                        description,
                        ingredients,
                        recipeMethod,
                        servings,
                        time,
                        link,
                        categories: {
                            connectOrCreate: categories.map(
                                (category) => ({
                                    where: {
                                        name: category,
                                    },
                                    create: {
                                        name: category,
                                    },
                                })
                            ),
                        },
                    },
                    include: recipePopulated,
                });

                console.log('NEW RECIPE ADDED:', newRecipe);

                // emit a RECIPE_CREATED event using pubsub
                pubsub.publish('RECIPE_CREATED', {
                    recipeCreated: newRecipe,
                });

                return {
                    recipeId: newRecipe.id,
                };
            } catch (error) {
                console.log('createRecipe error', error);
                throw new GraphQLError('Error creating recipe');
            }
        },
        deleteRecipe: async (
            _: any,
            args: { recipeId: string },
            context: GraphQLContext
        ): Promise<Boolean> => {
            const { session, prisma, pubsub } = context;
            const { recipeId } = args;

            if (!session?.user) {
                throw new GraphQLError('Not authorized');
            }

            /**
             * When recipe is deleted, all the categories associated with it has to be updated
             * 1. find the categories associated with the recipe
             * 2. remove the recipe from all the categories it is associated with
             * 3. remove all the empty categories (TODO: refactor?)
             * 4. delete the recipe
             */
            try {
                /**
                 * Retrieve the categories associated with the to-be-deleted recipe:
                 */
                const recipe = await prisma.recipe.findUnique({
                    where: {
                        id: recipeId,
                    },
                    include: {
                        categories: true,
                    },
                });

                /**
                 * Remove the recipe from the categories:
                 */
                if (recipe) {
                    /**
                     * Go through each of the categories the recipe is associated with
                     */
                    for (const category of recipe.categories) {
                        /**
                         * Remove the recipeId from the array
                         */
                        const filteredRecipeIds =
                            category.recipeIDs.filter(
                                (id) => id !== recipeId
                            );

                        /**
                         * Update the new array to each of the categories
                         */
                        await prisma.category.update({
                            where: {
                                id: category.id,
                            },
                            data: {
                                recipeIDs: {
                                    // The 'set' operator replaces the existing array with a new array
                                    set: filteredRecipeIds,
                                },
                            },
                        });
                    }

                    /**
                     * Remove empty categories from the database
                     *
                     * TODO: don't go through every category instance?
                     * Instead, check only the ones that were updated.
                     */
                    // Find categories with empty recipeIDs
                    const emptyCategories =
                        await prisma.category.findMany({
                            where: {
                                recipeIDs: {
                                    isEmpty: true,
                                },
                            },
                        });

                    // Remove empty categories
                    await prisma.category.deleteMany({
                        where: {
                            id: {
                                in: emptyCategories.map(
                                    (category) => category.id
                                ),
                            },
                        },
                    });

                    /**
                     * Delete the recipe:
                     */
                    const deletedRecipe = await prisma.recipe.delete({
                        where: {
                            id: recipeId,
                        },
                    });

                    const emptyCategoriesIDs = emptyCategories.map(
                        (a) => a.id
                    );

                    pubsub.publish('RECIPE_DELETED', {
                        recipeDeleted: {
                            recipe: deletedRecipe,
                            removedCategoriesIds: emptyCategoriesIDs,
                        },
                    });
                }

                return true;
            } catch (error: any) {
                console.log('deleteRecipe error', error);
                throw new GraphQLError(error.message);
            }
        },
        updateRecipe: async (
            _: any,
            args: {
                recipeId: string;
                title: string;
                description: string;
                ingredients: string;
                recipeMethod: string[];
                servings: number;
                time: number;
                link: string;
                categories: string[];
            },
            context: GraphQLContext
        ): Promise<RecipePopulated> => {
            const { session, prisma, pubsub } = context;
            const {
                recipeId,
                title: newTitle,
                description,
                ingredients,
                recipeMethod: newMethod,
                servings,
                time,
                link,
                categories,
            } = args;

            if (!session?.user) {
                throw new GraphQLError('Not authorized');
            }
            try {
                /**
                 * When recipe is updated, we need to make sure the related
                 * categories are updated respectively. The process:
                 *
                 * 1. Check whether the recipe has any categories
                 *      2. If yes, checking whether any categories were deleted.
                 *          3. If yes, remove the recipeID from all the categories
                 *             it is associated with and categoryIDs from the recipe.
                 * 4. Update the recipe with new arguments
                 *      5. Create new or connect to existing categories
                 *
                 * TODO: Prisma transaction?
                 */

                /**
                 * Retrieve the categories associated with the recipe
                 */
                const recipe = await prisma.recipe.findUnique({
                    where: {
                        id: recipeId,
                    },
                    include: {
                        categories: true,
                    },
                });

                const oldCategories = recipe?.categories ?? [];

                /**
                 * Check if recipe has categories in the first place. If yes:
                 * 1) update the recipeID in all related category instances, and
                 * 2) update the categoryIDs of the recipe instance
                 */
                if (recipe) {
                    // if the length of deletedCategories > 0, categories have been deleted
                    const deletedCategories = oldCategories.filter(
                        (i) => !categories.includes(i.name)
                    );

                    if (deletedCategories.length) {
                        /**
                         * Remove the recipeIDs from deleted categories.
                         * Go through each of the deleted categories the recipe is associated with
                         */
                        for (const category of deletedCategories) {
                            /**
                             * Remove the deleted recipeId from the array
                             */
                            const updatedRecipeIds =
                                category.recipeIDs.filter(
                                    (id) => id !== recipeId
                                );

                            /**
                             * Update the new array to each of the categories
                             */
                            await prisma.category.update({
                                where: {
                                    id: category.id,
                                },
                                data: {
                                    recipeIDs: {
                                        // The 'set' operator replaces the existing array with a new array
                                        set: updatedRecipeIds,
                                    },
                                },
                            });
                        }

                        /**
                         * Remove the categoryIDs from the recipe
                         */
                        const updatedCategoryIds = oldCategories
                            .filter((i) =>
                                categories.includes(i.name)
                            )
                            .map((c) => c.id);

                        await prisma.recipe.update({
                            where: {
                                id: recipeId,
                            },
                            data: {
                                categoryIDs: updatedCategoryIds,
                            },
                        });
                    }
                }

                /**
                 * Update all the fields
                 */
                const updatedRecipe = await prisma.recipe.update({
                    where: {
                        id: recipeId,
                    },
                    data: {
                        name: newTitle,
                        description,
                        ingredients,
                        recipeMethod: newMethod,
                        servings,
                        time,
                        link,
                        categories: {
                            connectOrCreate: categories.map(
                                (category) => ({
                                    where: {
                                        name: category,
                                    },
                                    create: {
                                        name: category,
                                    },
                                })
                            ),
                        },
                    },
                    include: recipePopulated,
                });

                /**
                 * Remove empty categories from the database
                 *
                 * TODO: don't go through every category instance?
                 * Instead, check only the ones that were updated.
                 */
                // Find categories with empty recipeIDs
                const emptyCategories =
                    await prisma.category.findMany({
                        where: {
                            recipeIDs: {
                                isEmpty: true,
                            },
                        },
                    });

                // Remove empty categories
                await prisma.category.deleteMany({
                    where: {
                        id: {
                            in: emptyCategories.map(
                                (category) => category.id
                            ),
                        },
                    },
                });

                /**
                 * Get the newly added categories
                 */
                const newRecipe = await prisma.recipe.findUnique({
                    where: {
                        id: recipeId,
                    },
                    include: {
                        categories: true,
                    },
                });

                const newSetOfCategories =
                    newRecipe?.categories ?? [];

                const addedCategories = newSetOfCategories.filter(
                    (newCategory) => {
                        return !oldCategories.some(
                            (oldCategory) =>
                                oldCategory.id === newCategory.id
                        );
                    }
                );

                /**
                 * Get empty categories
                 */
                const emptyCategoriesIds = emptyCategories.map(
                    (i) => i.id
                );

                pubsub.publish('RECIPE_UPDATED', {
                    recipeUpdated: {
                        recipe: updatedRecipe,
                        addedCategories: addedCategories,
                        emptyCategoriesIds: emptyCategoriesIds,
                    },
                });
                return updatedRecipe;
            } catch (error: any) {
                console.log('updateRecipe error', error);
                throw new GraphQLError(error.message);
            }
        },
    },
    Subscription: {
        recipeCreated: {
            subscribe: (_: any, __: any, context: GraphQLContext) => {
                const { pubsub } = context;

                return pubsub.asyncIterator(['RECIPE_CREATED']);
            },
        },
        recipeDeleted: {
            subscribe: withFilter(
                (_: any, __: any, context: GraphQLContext) => {
                    const { pubsub } = context;

                    return pubsub.asyncIterator(['RECIPE_DELETED']);
                },
                (
                    payload: RecipeDeletedSubscriptionPayload,
                    _,
                    context: GraphQLContext
                ) => {
                    const { session } = context;

                    if (!session?.user) {
                        throw new GraphQLError('Not authorized');
                    }

                    const { id } = session.user;
                    const {
                        recipeDeleted: {
                            recipe: { userId },
                        },
                    } = payload;

                    return userId === id;
                }
            ),
        },
        recipeUpdated: {
            subscribe: withFilter(
                (_: any, __: any, context: GraphQLContext) => {
                    const { pubsub } = context;

                    return pubsub.asyncIterator(['RECIPE_UPDATED']);
                },
                (
                    payload: RecipeUpdatedSubscriptionPayload,
                    _,
                    context: GraphQLContext
                ) => {
                    const { session } = context;

                    if (!session?.user) {
                        throw new GraphQLError('Not authorized');
                    }

                    const { id } = session.user;
                    const {
                        recipeUpdated: {
                            recipe: { userId },
                        },
                    } = payload;

                    return userId === id;
                }
            ),
        },
    },
};

export const recipePopulated =
    Prisma.validator<Prisma.RecipeInclude>()({
        categories: {
            include: {
                recipes: {
                    select: {
                        name: true,
                    },
                },
            },
        },
        user: {
            select: {
                username: true,
            },
        },
    });

export default resolvers;
