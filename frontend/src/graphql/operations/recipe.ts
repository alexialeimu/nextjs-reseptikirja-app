import { gql } from '@apollo/client';

const recipeQueryStrings = {
    Queries: {},
    Mutations: {
        createRecipe: gql`
            mutation CreateRecipe($title: String!) {
                createRecipe(title: $title) {
                    recipeId
                }
            }
        `,
    },
    Subscriptions: {},
};

export default recipeQueryStrings;
