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
    },
    Subscriptions: {
        recipeCreated: gql`
            subscription RecipeCreated {
                recipeCreated {
                    ${RecipeStrippedFields}
                }
            }
        `,
    },
};

export default recipeQueryStrings;
