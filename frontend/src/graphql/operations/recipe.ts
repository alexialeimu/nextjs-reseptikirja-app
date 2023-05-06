import { gql } from '@apollo/client';

const RecipeAllFields = `
    id
    name
    user {
        username
    }
    description
    ingredients
    recipeMethod
`;

const RecipeStrippedFields = `
    id
    name
    user {
        username
    }
`;

const recipeQueryStrings = {
    Queries: {
        GET_RECIPE: gql`
            query getRecipe($recipeId: String!) {
                recipe(recipeId: $recipeId) {
                    ${RecipeAllFields}
                }
            }
        `,
        GET_ALL_RECIPES: gql`
            query Recipes {
                recipes {
                    ${RecipeStrippedFields}
                }
            }
        `,
    },
    Mutations: {
        CREATE_RECIPE: gql`
            mutation CreateRecipe(
                $title: String!
                $userId: String!
                $description: String
                $ingredients: String
                $recipeMethod: [String]
            ) {
                createRecipe(
                    title: $title
                    userId: $userId
                    description: $description
                    ingredients: $ingredients
                    recipeMethod: $recipeMethod
                ) {
                    recipeId
                }
            }
        `,
        DELETE_RECIPE: gql`
            mutation deleteRecipe($recipeId: String!) {
                deleteRecipe(recipeId: $recipeId)
            }
        `,
        UPDATE_RECIPE: gql`
            mutation updateRecipe(
                $recipeId: String!
                $title: String
                $description: String
                $ingredients: String
                $recipeMethod: [String]
            ) {
                updateRecipe(
                    recipeId: $recipeId
                    title: $title
                    description: $description
                    ingredients: $ingredients
                    recipeMethod: $recipeMethod
                ) {
                    ${RecipeAllFields}
                }
            }
        `,
    },
    Subscriptions: {
        RECIPE_CREATED_SUBSCRIPTION: gql`
            subscription RecipeCreated {
                recipeCreated {
                    ${RecipeStrippedFields}
                }
            }
        `,
        RECIPE_DELETED_SUBSCRIPTION: gql`
            subscription RecipeDeleted {
                recipeDeleted {
                    id
                }
            }
        `,
        RECIPE_UPDATED_SUBSCRIPTION: gql`
            subscription RecipeUpdated {
                recipeUpdated {
                    ${RecipeAllFields}
                }
            }
        `,
    },
};

export default recipeQueryStrings;
