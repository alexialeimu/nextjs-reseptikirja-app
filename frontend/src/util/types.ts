import { RecipePopulated } from './../../../backend/src/util/types';

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
export interface RecipeData {
    recipe: RecipePopulated;
}

export interface RecipesData {
    recipes: Array<RecipePopulated>;
}

export interface RecipeCreatedSubscriptionData {
    subscriptionData: {
        data: {
            recipeCreated: RecipePopulated;
        };
    };
}

export interface RecipeUpdatedSubscriptionData {
    recipeUpdated: RecipePopulated;
}

export interface CreateRecipeData {
    createRecipe: {
        recipeId: string;
    };
}

export interface CreateRecipeInput {
    title: string;
    method: string;
    userId: string;
}

export interface UpdateRecipeData {
    updateRecipe: {
        success: boolean;
        error: string;
    };
}

export interface UpdateRecipeInput {
    recipeId: string;
    title: string;
    method: string;
}

export interface RecipeDeletedData {
    recipeDeleted: {
        id: string;
    };
}
