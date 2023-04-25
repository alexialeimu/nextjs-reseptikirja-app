import userResolvers from './user';
import recipeResolvers from './recipe';
import merge from 'lodash.merge';

const resolvers = merge({}, userResolvers, recipeResolvers);

export default resolvers;
