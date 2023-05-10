import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../../util/types';
import { Prisma } from '@prisma/client';

const resolvers = {
    Query: {
        categories: async (
            _: any,
            __: any,
            context: GraphQLContext
        ) => {
            const { session, prisma } = context;

            if (!session?.user) {
                throw new GraphQLError('Not authorized');
            }

            try {
                const categories = await prisma.category.findMany({
                    include: categoryPopulated,
                });

                return categories;
            } catch (error: any) {
                console.log('getCategories error', error);
                throw new GraphQLError(error?.message);
            }
        },
    },
    Mutation: {},
    Subscription: {},
};

export const categoryPopulated =
    Prisma.validator<Prisma.CategoryInclude>()({
        recipes: {
            select: {
                name: true,
            },
        },
    });

export default resolvers;
