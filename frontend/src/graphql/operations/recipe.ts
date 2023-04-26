import { gql } from '@apollo/client';

const recipeQueryStrings = {
    Queries: {
        recipes: gql`
            query Recipes {
                recipes {
                    id
                    name
                    user {
                        username
                    }
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
    Subscriptions: {},
};

export default recipeQueryStrings;
