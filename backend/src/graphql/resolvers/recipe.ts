// import { recipePopulated } from './recipe';
import { Prisma } from '@prisma/client';
import { GraphQLContext } from './../../util/types';
import { ApolloError } from 'apollo-server-core';

const resolvers = {
    Query: {
        recipes: async (_: any, __: any, context: GraphQLContext) => {
            const { session, prisma } = context;

            if (!session?.user) {
                throw new ApolloError('Not authorized');
            }

            const {
                user: { id: userId },
            } = session;

            try {
                const recipes = await prisma.recipe.findMany({
                    include: {
                        user: {
                            select: {
                                username: true,
                            },
                        },
                    },
                });

                console.log('BACKEND', recipes);

                return recipes;
            } catch (error: any) {
                console.log('recipes error', error);
                throw new ApolloError(error?.message);
            }
        },
    },
    Mutation: {
        createRecipe: async (
            _: any,
            args: { title: string; userId: string },
            context: GraphQLContext
            // ): Promise<{ recipeId: string }> => {
        ) => {
            const { session, prisma } = context;
            const { title, userId } = args;

            console.log('CREATE RECIPE ARGS:', args);

            if (!session?.user) {
                throw new ApolloError('Not authorized');
            }

            try {
                const newRecipe = await prisma.recipe.create({
                    data: {
                        name: title,
                        userId: userId,
                    },
                });
                return {
                    recipeId: newRecipe.id,
                };
            } catch (error) {
                console.log('createRecipe error', error);
                throw new ApolloError('Error creating recipe');
            }
        },
    },
};

export default resolvers;
