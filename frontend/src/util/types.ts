// import { RecipePopulated } from './../../../backend/src/util/types';

/**
 * Users
 */
export interface CreateUsernameData {
    createUsername: {
        success: boolean;
        error: string;
    };
}

export interface CreateUsernameVariables {
    username: string;
}

/**
 * Recipes
 */
// temporal (use RecipePopulated instead):
// export interface RecipesData {
//     recipes: Array<RecipePopulated>;
// }

export interface CreateRecipeData {
    createRecipe: {
        recipeId: string;
    };
}

export interface CreateRecipeInput {
    title: string;
    userId: string;
}
