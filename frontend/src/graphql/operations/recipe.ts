import { gql } from '@apollo/client';

const RecipeAllFields = `
    id
    name
    user {
        username
    }
    instructions
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
        recipes: gql`
            query Recipes {
                recipes {
                    ${RecipeStrippedFields}
                }
            }
        `,
    },
    Mutations: {
        createRecipe: gql`
            mutation CreateRecipe(
                $title: String!
                $userId: String!
                $instructions: String
            ) {
                createRecipe(
                    title: $title
                    userId: $userId
                    instructions: $instructions
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
    },
    Subscriptions: {
        recipeCreated: gql`
            subscription RecipeCreated {
                recipeCreated {
                    ${RecipeStrippedFields}
                }
            }
        `,
        recipeDeleted: gql`
            subscription RecipeDeleted {
                recipeDeleted {
                    id
                }
            }
        `,
    },
};

export default recipeQueryStrings;
