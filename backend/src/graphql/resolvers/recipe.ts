// import { recipePopulated } from './recipe';
import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { GraphQLContext } from './../../util/types';

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
                instructions: string;
            },
            context: GraphQLContext
        ): Promise<{ recipeId: string }> => {
            const { session, prisma, pubsub } = context;
            const { title, userId, instructions } = args;

            if (!session?.user) {
                throw new GraphQLError('Not authorized');
            }

            try {
                const newRecipe = await prisma.recipe.create({
                    data: {
                        name: title,
                        userId: userId,
                        instructions,
                    },
                    include: recipePopulated,
                });

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
    },
    Subscription: {
        recipeCreated: {
            subscribe: (_: any, __: any, context: GraphQLContext) => {
                const { pubsub } = context;

                return pubsub.asyncIterator(['RECIPE_CREATED']);
            },
        },
    },
};

export const recipePopulated =
    Prisma.validator<Prisma.RecipeInclude>()({
        user: {
            select: {
                username: true,
            },
        },
    });

export default resolvers;
