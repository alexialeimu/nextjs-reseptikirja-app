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
export interface CreateRecipeData {
    createRecipe: {
        recipeId: string;
    };
}

export interface CreateRecipeInput {
    title: String;
}
