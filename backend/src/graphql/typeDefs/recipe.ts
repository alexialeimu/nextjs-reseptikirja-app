import gql from 'graphql-tag';

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
        createdAt: Date
        updatedAt: Date
        name: String
        user: User
        instructions: String
    }

    type RecipeTitleAndUser {
        id: String
        createdAt: Date
        updatedAt: Date
        name: String
        user: User
    }

    type Query {
        recipe(recipeId: String): Recipe
    }

    type Query {
        recipes: [RecipeTitleAndUser]
    }

    type Subscription {
        recipeCreated: Recipe
    }
`;

export default typeDefs;
