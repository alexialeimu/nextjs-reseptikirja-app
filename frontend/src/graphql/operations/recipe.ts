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
    servings
    time
    link
    categories {
        name
    }
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
                $servings: Int
                $time: Int
                $link: String
                $categories: [String]
            ) {
                createRecipe(
                    title: $title
                    userId: $userId
                    description: $description
                    ingredients: $ingredients
                    recipeMethod: $recipeMethod
                    servings: $servings
                    time: $time
                    link: $link
                    categories: $categories
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
                $servings: Int
                $time: Int
                $link: String
                $categories: [String]
            ) {
                updateRecipe(
                    recipeId: $recipeId
                    title: $title
                    description: $description
                    ingredients: $ingredients
                    recipeMethod: $recipeMethod
                    servings: $servings
                    time: $time
                    link: $link
                    categories: $categories
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
                    recipe {
                        ${RecipeStrippedFields}
                    }
                    addedCategories {
                        id
                        name
                        recipeIDs
                    }
                }
            }
        `,
        RECIPE_DELETED_SUBSCRIPTION: gql`
            subscription RecipeDeleted {
                recipeDeleted {
                    recipe {
                        id
                    }
                    removedCategoriesIds
                }
            }
        `,
        RECIPE_UPDATED_SUBSCRIPTION: gql`
            subscription RecipeUpdated {
                recipeUpdated {
                    recipe {
                        ${RecipeStrippedFields}
                    }
                    addedCategories {
                        id
                        name
                        recipeIDs
                    }
                    emptyCategoriesIds
                }
            }
        `,
    },
};

export default recipeQueryStrings;
