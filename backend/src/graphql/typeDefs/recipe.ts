import { gql } from 'apollo-server-core';

const typeDefs = gql`
    type Mutation {
        createRecipe(title: String): createRecipeResponse
    }

    type createRecipeResponse {
        recipeId: String
    }
`;

export default typeDefs;
