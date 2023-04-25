import { GraphQLContext } from './../../util/types';
import { ApolloError } from 'apollo-server-core';

const resolvers = {
    // Query: {},
    Mutation: {
        createRecipe: async (
            _: any,
            args: { title: string },
            context: GraphQLContext
        ): Promise<{ recipeId: string }> => {
            const { session, prisma } = context;
            const { title } = args;

            if (!session?.user) {
                throw new ApolloError('Not authorized');
            }

            const {
                user: { id: userId },
            } = session;

            try {
                const recipe = await prisma.recipe.create({
                    data: {
                        name: title,
                    },
                });

                return {
                    recipeId: recipe.id,
                };
            } catch (error) {
                console.log('createRecipe error', error);
                throw new ApolloError('Error creating recipe');
            }
        },
    },
};

export default resolvers;
