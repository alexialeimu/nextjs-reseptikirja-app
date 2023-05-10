import userResolvers from './user';
import recipeResolvers from './recipe';
import categoryResolvers from './category';
import merge from 'lodash.merge';

const resolvers = merge(
    {},
    userResolvers,
    recipeResolvers,
    categoryResolvers
);

export default resolvers;
