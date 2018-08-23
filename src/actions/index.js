import { database } from "../firebase/index";
import uuid from "uuid/v4";

//Recipes
export const ADD_RECIPE_REQUESTED = "ADD_RECIPE_REQUESTED";
export const ADD_RECIPE_FAILED = "ADD_RECIPE_FAILED";
export const ADD_RECIPE_SUCCEED = "ADD_RECIPE_SUCCEED";
export const SET_CATEGORY_FILTER = "SET_CATEGORY_FILTER";
export const GET_RECIPES_REQUESTED = "GET_RECIPES_REQUESTED";
export const GET_RECIPES_FAILED = "GET_RECIPES_FAILED";
export const GET_RECIPES_SUCCESS = "GET_RECIPES_SUCCESS";

//CategoryFilter
export const CategoryFilter = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_VEGAN: "SHOW_VEGAN",
  SHOW_HEALTHY: "SHOW_HEALTHY"
};

//ShoppingList Creation
export const ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED = "ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED";
export const ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED = "ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED";
export const ADD_INGREDIENTS_SHOPPING_LIST_FAILED = "ADD_INGREDIENTS_SHOPPING_LIST_FAILED";
export const GET_SHOPPING_LIST_SUCCEED = "GET_SHOPPING_LIST_SUCCEED";
export const GET_SHOPPING_LIST_REQUESTED = "GET_SHOPPING_LIST_REQUESTED";
export const GET_SHOPPING_LIST_FAILED = "GET_SHOPPING_LIST_FAILED";

//ShoppingList Interaction
export const SELECT_SHOPPING_LIST_ITEM_STARTED = "SELECT_SHOPPING_LIST_ITEM_STARTED";
export const SELECT_SHOPPING_LIST_ITEM_FINISHED = "SELECT_SHOPPING_LIST_ITEM_FINISHED";
export const SELECT_SHOPPING_LIST_ITEM_FAILED = "SELECT_SHOPPING_LIST_ITEM_FAILED";

export const REMOVE_SHOPPING_LIST_ITEM_STARTED = "REMOVE_SHOPPING_LIST_ITEM_STARTED";
export const REMOVE_SHOPPING_LIST_ITEM_FINISHED = "REMOVE_SHOPPING_LIST_ITEM_FINISHED";
export const REMOVE_SHOPPING_LIST_ITEM_FAILED = "REMOVE_SHOPPING_LIST_ITEM_FAILED";

//TODO  implement the get selected item status instead of asking for the whole shoppinglist each time we update the pruchase status
// export const GET_SELECTED_ITEM_STATUS_STARTED = "GET_SELECTED_ITEM_STATUS_STARTED";
// export const GET_SELECTED_ITEM_STATUS_FINISHED = "GET_SELECTED_ITEM_STATUS_FINISHED";
// export const GET_SELECTED_ITEM_STATUS_FAILED = "GET_SELECTED_ITEM_STATUS_FAILED";

/*
Action creator
 */
export const selectShoppingListItemFinished = () => ({ type: SELECT_SHOPPING_LIST_ITEM_FINISHED });
export const selectShoppingListItemStarted = () => ({ type: SELECT_SHOPPING_LIST_ITEM_STARTED });
export const selectShoppingListItemFailed = () => ({ type: SELECT_SHOPPING_LIST_ITEM_FAILED });

export const removeShoppingListItemStarted = () => ({ type: REMOVE_SHOPPING_LIST_ITEM_STARTED });
export const removeShoppingListItemFinished = () => ({ type: REMOVE_SHOPPING_LIST_ITEM_FINISHED });
export const removeShoppingListItemFailed = () => ({ type: REMOVE_SHOPPING_LIST_ITEM_FAILED });

export const removeShoppingListItem = ingredientID => {
  const shoppingListItemRef = database.ref(`shoppingList/shoppingListItems/`);
  return dispatch => {
    dispatch(removeShoppingListItemStarted());
    shoppingListItemRef
      .update({ [ingredientID]: null })
      .then(() => dispatch(removeShoppingListItemFinished()))
      .then(() => dispatch(getShoppingList()))
      .catch(error => {
        console.log(error);
        return dispatch(removeShoppingListItemFailed());
      });
  };
};

export const addIngredientsToShoppingListCompleted = ingredients => {
  return {
    type: ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED,
    ingredients
  };
};

export const addIngredientsToShoppingListRequested = () => ({ type: ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED });
export const addIngredientsToShoppingListFailed = () => ({ type: ADD_INGREDIENTS_SHOPPING_LIST_FAILED });

const concatAllIngredientsIntoOneList = meal => {
  const concatIngredients = {};
  meal.ingredientsWithQuantityUpdated.map(ingredient => {
    const ingredientIdentified = { [ingredient.ingredientId]: { ...ingredient, purchased: false } };
    return Object.assign(concatIngredients, ingredientIdentified);
  });
  return concatIngredients;
};

export const selectShoppingListItem = (ingredientID, isPurchased) => {
  const shoppingListItemRef = database.ref(`shoppingList/shoppingListItems/${ingredientID}/`);
  return dispatch => {
    dispatch(selectShoppingListItemStarted());
    shoppingListItemRef
      .update({ purchased: !isPurchased })
      .then(() => dispatch(selectShoppingListItemFinished()))
      .then(() => dispatch(getShoppingList()))
      .catch(error => {
        console.log(error);
        return dispatch(selectShoppingListItemFailed());
      });
  };
};

export const addIngredientsToShoppingList = (meal, navigateToHome) => {
  let key = database.ref("/shoppingListRecipes").push().key;
  return dispatch => {
    dispatch(addIngredientsToShoppingListRequested());
    meal.id = key;
    const shoppingListRecipesRef = database.ref("shoppingList/shoppingListRecipes/" + key);
    const shoppingListRef = database.ref("shoppingList/shoppingListItems/");
    shoppingListRecipesRef
      .update(meal)
      .then(() => shoppingListRef.update(concatAllIngredientsIntoOneList(meal)))
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
    recipe.ingredients.map(ingredient => (ingredient.ingredientId = uuid()));
    const recipesRef = database.ref("/recipes/" + key);
    recipesRef
      .set(recipe)
      .then(() => dispatch(addRecipeSucess(recipe)))
      .then(() => navigateToHome())
      .catch(error => dispatch(addRecipeFailed()));
  };
};

const addRecipeRequested = () => ({ type: ADD_RECIPE_REQUESTED });
const addRecipeFailed = () => ({ type: ADD_RECIPE_FAILED });
const addRecipeSucess = () => ({ type: ADD_RECIPE_SUCCEED });

export function setCategoryFilter(category) {
  return { type: SET_CATEGORY_FILTER, category };
}
const getRecipesRequested = () => ({ type: GET_RECIPES_REQUESTED });
const getRecipesFailed = () => ({ type: GET_RECIPES_FAILED });

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
  return {
    type: GET_SHOPPING_LIST_SUCCEED,
    shoppingList,
    receivedAt: Date.now()
  };
};

export const getShoppingList = () => {
  return dispatch => {
    dispatch(getShoppingListRequested());
    return database
      .ref(`/shoppingList`)
      .once("value")
      .then(snapshot => dispatch(getShoppingListSucceed(snapshot.val())))
      .catch(error => {
        console.log(error);
        dispatch(getShoppingListFailed());
      });
  };
};
