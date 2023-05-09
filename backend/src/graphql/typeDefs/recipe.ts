import gql from 'graphql-tag';

const typeDefs = gql`
    scalar Date

    type Mutation {
        createRecipe(
            title: String!
            userId: String!
            description: String
            ingredients: String
            recipeMethod: [String]
            servings: Int
            time: Int
            link: String
            categories: [String]
        ): createRecipeResponse
    }

    type createRecipeResponse {
        recipeId: String
    }

    type Recipe {
        id: String!
        createdAt: Date
        updatedAt: Date
        name: String!
        user: User
        description: String
        ingredients: String
        recipeMethod: [String]
        servings: Int
        time: Int
        link: String
        categories: [Category]
    }

    type Category {
        id: String!
        name: String
        recipes: [Recipe]
    }

    type RecipeTitleAndUser {
        id: String
        createdAt: Date
        updatedAt: Date
        name: String
        user: User
    }

    type RecipeDeletedSubscriptionResponse {
        id: String
    }

    type Query {
        recipe(recipeId: String): Recipe
    }

    type Query {
        recipes: [RecipeTitleAndUser]
    }

    type Mutation {
        deleteRecipe(recipeId: String!): Boolean
    }

    type Mutation {
        updateRecipe(
            recipeId: String!
            title: String
            description: String
            ingredients: String
            recipeMethod: [String]
            servings: Int
            time: Int
            link: String
        ): Recipe
    }

    type Subscription {
        recipeCreated: Recipe
    }

    type Subscription {
        recipeDeleted: RecipeDeletedSubscriptionResponse
    }

    type Subscription {
        recipeUpdated: Recipe
    }
`;

export default typeDefs;
