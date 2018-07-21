import { database } from "../firebase/index";

/*
action types
 */

//Add recipe
export const ADD_RECIPE_REQUESTED = "ADD_RECIPE_REQUESTED";
export const ADD_RECIPE_FAILED = "ADD_RECIPE_FAILED";
export const ADD_RECIPE_SUCCEED = "ADD_RECIPE_SUCCEED";
export const SET_CATEGORY_FILTER = "SET_CATEGORY_FILTER";
export const GET_RECIPES_REQUESTED = "GET_RECIPES_REQUESTED";
export const GET_RECIPES_FAILED = "GET_RECIPES_FAILED";
export const GET_RECIPES_SUCCESS = "GET_RECIPES_SUCCESS";
export const CategoryFilter = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_VEGAN: "SHOW_VEGAN",
  SHOW_HEALTHY: "SHOW_HEALTHY"
};
export const ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED = "ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED";
export const ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED = "ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED";
export const ADD_INGREDIENTS_SHOPPING_LIST_FAILED = "ADD_INGREDIENTS_SHOPPING_LIST_FAILED";
export const GET_SHOPPING_LIST_SUCCEED = "GET_SHOPPING_LIST_SUCCEED";
export const GET_SHOPPING_LIST_REQUESTED = "GET_SHOPPING_LIST_REQUESTED";
export const GET_SHOPPING_LIST_FAILED = "GET_SHOPPING_LIST_FAILED";

/*
Action creator
 */

export const addIngredientsToShoppingListCompleted = ingredients => {
  return {
    type: ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED,
    ingredients
  };
};

export const addIngredientsToShoppingListRequested = () => {
  return {
    type: ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED
  };
};

export const addIngredientsToShoppingListFailed = () => {
  return {
    type: ADD_INGREDIENTS_SHOPPING_LIST_FAILED
  };
};

export const addIngredientsToShoppingList = (meal, navigateToHome) => {
  console.log("meal in reducer", meal);
  let key = database.ref("/shoppingList").push().key;
  return dispatch => {
    dispatch(addIngredientsToShoppingListRequested());
    meal.id = key;
    const shoppingListRef = database.ref("/shoppingList/" + key);
    shoppingListRef
      .set(meal)
      .then(() => dispatch(addIngredientsToShoppingListCompleted()))
      .then(() => navigateToHome())
      .catch(error => {
        console.log(error);
        return dispatch(addIngredientsToShoppingListFailed());
      });
  };
};

export const addRecipe = (recipe, navigateToHome) => {
  let key = database.ref("/recipes").push().key;
  return dispatch => {
    dispatch(addRecipeRequested());
    recipe.recipeId = key;
    recipe.ingredients.map(ingredient => (ingredient.ingredientId = ingredient.name + key));
    const recipesRef = database.ref("/recipes/" + key);
    recipesRef
      .set(recipe)
      .then(() => dispatch(addRecipeSucess(recipe)))
      .then(() => navigateToHome())
      .catch(error => dispatch(addRecipeFailed()));
  };
};

function addRecipeRequested() {
  return {
    type: ADD_RECIPE_REQUESTED
  };
}

function addRecipeFailed() {
  return {
    type: ADD_RECIPE_FAILED
  };
}

function addRecipeSucess() {
  return {
    type: ADD_RECIPE_SUCCEED
  };
}

export function setCategoryFilter(category) {
  return { type: SET_CATEGORY_FILTER, category };
}

function getRecipesRequested() {
  return {
    type: GET_RECIPES_REQUESTED
  };
}
function getRecipesFailed() {
  return {
    type: GET_RECIPES_FAILED
  };
}

function getRecipesSuccess(recipes) {
  return {
    type: GET_RECIPES_SUCCESS,
    recipes,
    receivedAt: Date.now()
  };
}

export function getRecipes() {
  return function(dispatch) {
    dispatch(getRecipesRequested());
    return database
      .ref(`/recipes`)
      .once("value")
      .then(snapshot => {
        dispatch(getRecipesSuccess(snapshot.val()));
      })
      .catch(error => {
        console.log(error);
        dispatch(getRecipesFailed());
      });
  };
}

const getShoppingListRequested = () => ({ type: GET_SHOPPING_LIST_REQUESTED });
const getShoppingListFailed = () => ({ type: GET_SHOPPING_LIST_FAILED });

const getShoppingListSucceed = shoppingList => {
  console.log("shoppingList Suceeded");
  return {
    type: GET_SHOPPING_LIST_SUCCEED,
    shoppingList,
    receivedAt: Date.now()
  };
};

export const getShoppingList = () => {
  console.log("didmount");
  return dispatch => {
    dispatch(getShoppingListRequested());
    return database
      .ref(`/shoppingList`)
      .once("value")
      .then(snapshot => {
        console.log("shoppingList", snapshot.val());
        return dispatch(getShoppingListSucceed(snapshot.val()));
      })
      .catch(error => {
        console.log(error);
        dispatch(getShoppingListFailed());
      });
  };
};
