import { gql } from 'apollo-server-core';

const typeDefs = gql`
    scalar Date

    type Mutation {
        createRecipe(
            title: String!
            instructions: String
            userId: String!
        ): createRecipeResponse
    }

    type createRecipeResponse {
        recipeId: String
    }

    type Recipe {
        id: String
        name: String
        user: User
        createdAt: Date
        updatedAt: Date
        # instructions: String
    }
    type Query {
        recipes: [Recipe]
    }

    type Subscription {
        recipeCreated: Recipe
    }
`;

export default typeDefs;
