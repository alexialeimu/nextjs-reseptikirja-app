import gql from 'graphql-tag';

const typeDefs = gql`
    scalar Date

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

    #
    # QUERIES
    #

    type Query {
        recipe(recipeId: String): Recipe
    }

    type Query {
        recipes: [RecipeTitleAndUser]
    }

    #
    # MUTATIONS
    #

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
            categories: [String]
        ): Recipe
    }

    #
    # SUBSCRIPTIONS
    #

    type Subscription {
        recipeCreated: Recipe
    }

    type Subscription {
        recipeDeleted: RecipeDeletedSubscriptionResponse
    }

    type RecipeDeletedSubscriptionResponse {
        recipe: Recipe
        removedCategoriesIds: [String]
    }

    type Subscription {
        recipeUpdated: Recipe
    }
`;

export default typeDefs;
