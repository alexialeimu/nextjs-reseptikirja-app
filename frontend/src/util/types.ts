import {
    CategoryPopulated,
    RecipePopulated,
} from './../../../backend/src/util/types';

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
export interface RecipeState {
    title: string;
    description: string;
    ingredients: string;
    recipeMethod: string[];
    servings: number;
    time: number;
    link: string;
    categories: string[];
}

export interface RecipeData {
    recipe: RecipePopulated;
}

export interface RecipesData {
    recipes: Array<RecipePopulated>;
}

export interface CreateRecipeData {
    createRecipe: {
        recipeId: string;
    };
}

export interface CreateRecipeInput {
    userId: string;
    title: string;
    description: string;
    ingredients: string;
    recipeMethod: string[];
    servings: number;
    time: number;
    link: string;
    categories: string[];
}

export interface RecipeCreatedSubscriptionData {
    subscriptionData: {
        data: {
            recipeCreated: {
                recipe: RecipePopulated;
                addedCategories: Array<CategoryPopulated>;
            };
        };
    };
}

export interface UpdateRecipeInput {
    recipeId: string;
    title: string;
    description: string;
    ingredients: string;
    recipeMethod: string[];
    servings: number;
    time: number;
    link: string;
    categories: string[];
}

export interface RecipeDeletedSubscriptionData {
    recipeDeleted: {
        recipe: RecipePopulated;
        removedCategoriesIds: Array<string> | null;
    };
}

export interface RecipeUpdatedSubscriptionData {
    recipeUpdated: {
        recipe: RecipePopulated;
        addedCategories: Array<CategoryPopulated>;
        emptyCategoriesIds: Array<string>;
    };
}

/**
 * Categories
 */
export interface CategoriesData {
    categories: Array<CategoryPopulated>;
}
