import { GraphQLContext } from './../../util/types';

const resolvers = {
    // Query: {},
    Mutation: {
        createRecipe: async (
            _: any,
            args: { title: String },
            context: GraphQLContext
        ) => {
            console.log('Hello from createRecipe mutation!', args);
        },
    },
};

export default resolvers;
