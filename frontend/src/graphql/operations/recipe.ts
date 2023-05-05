import { gql } from '@apollo/client';

const RecipeAllFields = `
    id
    name
    user {
        username
    }
    method
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
                $method: String
            ) {
                createRecipe(
                    title: $title
                    userId: $userId
                    method: $method
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
                $method: String
            ) {
                updateRecipe(
                    recipeId: $recipeId
                    title: $title
                    method: $method
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
