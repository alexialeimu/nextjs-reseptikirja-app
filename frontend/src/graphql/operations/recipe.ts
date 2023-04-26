import { gql } from '@apollo/client';

const RecipeFields = `
    id
    name
    user {
        username
    }
`;

const recipeQueryStrings = {
    Queries: {
        recipes: gql`
            query Recipes {
                recipes {
                    ${RecipeFields}
                }
            }
        `,
    },
    Mutations: {
        createRecipe: gql`
            mutation CreateRecipe($title: String!, $userId: String!) {
                createRecipe(title: $title, userId: $userId) {
                    recipeId
                }
            }
        `,
    },
    Subscriptions: {
        recipeCreated: gql`
            subscription RecipeCreated {
                recipeCreated {
                    ${RecipeFields}
                }
            }
        `,
    },
};

export default recipeQueryStrings;
