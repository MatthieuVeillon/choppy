import { database } from "../../firebase/index";
import _ from "lodash";

//Actions
export const ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED = "ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED";
export const ADD_INGREDIENTS_SHOPPING_LIST_FAILED = "ADD_INGREDIENTS_SHOPPING_LIST_FAILED";
export const ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED = "ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED";

export const GET_SHOPPING_LIST_REQUESTED = "GET_SHOPPING_LIST_REQUESTED";
export const GET_SHOPPING_LIST_FAILED = "GET_SHOPPING_LIST_FAILED";
export const GET_SHOPPING_LIST_SUCCEED = "GET_SHOPPING_LIST_SUCCEED";

export const SELECT_SHOPPING_LIST_ITEM_STARTED = "SELECT_SHOPPING_LIST_ITEM_STARTED";
export const SELECT_SHOPPING_LIST_ITEM_FAILED = "SELECT_SHOPPING_LIST_ITEM_FAILED";
export const SELECT_SHOPPING_LIST_ITEM_FINISHED = "SELECT_SHOPPING_LIST_ITEM_FINISHED";

export const REMOVE_SHOPPING_LIST_ITEM_STARTED = "REMOVE_SHOPPING_LIST_ITEM_STARTED";
export const REMOVE_SHOPPING_LIST_ITEM_FAILED = "REMOVE_SHOPPING_LIST_ITEM_FAILED";
export const REMOVE_SHOPPING_LIST_ITEM_FINISHED = "REMOVE_SHOPPING_LIST_ITEM_FINISHED";

export const REMOVE_SHOPPING_LIST_RECIPE_STARTED = "REMOVE_SHOPPING_LIST_RECIPE_STARTED";
export const REMOVE_SHOPPING_LIST_RECIPE_FAILED = "REMOVE_SHOPPING_LIST_RECIPE_FAILED";
export const REMOVE_SHOPPING_LIST_RECIPE_FINISHED = "REMOVE_SHOPPING_LIST_RECIPE_FINISHED";

// Action Creators
export const selectShoppingListItemStarted = () => ({ type: SELECT_SHOPPING_LIST_ITEM_STARTED });
export const selectShoppingListItemFailed = () => ({ type: SELECT_SHOPPING_LIST_ITEM_FAILED });
export const selectShoppingListItemFinished = () => ({ type: SELECT_SHOPPING_LIST_ITEM_FINISHED });

export const removeShoppingListItemStarted = () => ({ type: REMOVE_SHOPPING_LIST_ITEM_STARTED });
export const removeShoppingListItemFailed = () => ({ type: REMOVE_SHOPPING_LIST_ITEM_FAILED });
export const removeShoppingListItemFinished = () => ({ type: REMOVE_SHOPPING_LIST_ITEM_FINISHED });

export const removeShoppingListRecipeStarted = () => ({ type: REMOVE_SHOPPING_LIST_RECIPE_STARTED });
export const removeShoppingListRecipeFailed = () => ({ type: REMOVE_SHOPPING_LIST_RECIPE_FAILED });
export const removeShoppingListRecipeFinished = () => ({ type: REMOVE_SHOPPING_LIST_RECIPE_FINISHED });

const getShoppingListRequested = () => ({ type: GET_SHOPPING_LIST_REQUESTED });
const getShoppingListFailed = () => ({ type: GET_SHOPPING_LIST_FAILED });
const getShoppingListSucceed = shoppingList => {
  return {
    type: GET_SHOPPING_LIST_SUCCEED,
    shoppingList,
    receivedAt: Date.now()
  };
};
export const addIngredientsToShoppingListRequested = () => ({ type: ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED });
export const addIngredientsToShoppingListFailed = () => ({ type: ADD_INGREDIENTS_SHOPPING_LIST_FAILED });
export const addIngredientsToShoppingListCompleted = ingredients => {
  return {
    type: ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED,
    ingredients
  };
};

//TODO  implement the get selected item status instead of asking for the whole shoppinglist each time we update the pruchase status
// export const GET_SELECTED_ITEM_STATUS_STARTED = "GET_SELECTED_ITEM_STATUS_STARTED";
// export const GET_SELECTED_ITEM_STATUS_FINISHED = "GET_SELECTED_ITEM_STATUS_FINISHED";
// export const GET_SELECTED_ITEM_STATUS_FAILED = "GET_SELECTED_ITEM_STATUS_FAILED";

export const shoppingList = (state = [], action) => {
  switch (action.type) {
    case ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED:
      return {
        ...state,
        inProgress: true,
        error: "",
        sucess: ""
      };
    case ADD_INGREDIENTS_SHOPPING_LIST_FAILED:
      return {
        ...state,
        inProgress: false,
        error: "Error in getting shoppingList"
      };
    case ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED:
      return {
        ...state,
        inProgress: false,
        success: "Added items to shopping List"
      };
    case GET_SHOPPING_LIST_REQUESTED:
      return {
        ...state,
        inProgress: true,
        error: "",
        success: ""
      };
    case GET_SHOPPING_LIST_FAILED:
      return {
        ...state,
        inProgress: false,
        error: "Error in getting recipes"
      };
    case GET_SHOPPING_LIST_SUCCEED:
      return {
        ...state,
        shoppingListItems:
          action.shoppingList !== null
            ? Object.keys(action.shoppingList.shoppingListItems).map(item => action.shoppingList.shoppingListItems[item])
            : [],
        shoppingListRecipes:
          action.shoppingList !== null
            ? Object.keys(action.shoppingList.shoppingListRecipes).map(item => action.shoppingList.shoppingListRecipes[item])
            : [],
        lastUpdated: action.receivedAt,
        inProgress: false,
        success: "Got shoppingList"
      };
    default:
      return state;
  }
};

// Side Effects
export const filterIngredientsToRemove = (recipeId, shoppingListItems) =>
  _.filter(shoppingListItems, ingredient => {
    return ingredient.recipeId === recipeId;
  });

export const removeShoppingListRecipe = recipeId => {
  const shoppingListRecipeRef = database.ref("shoppingList/shoppingListRecipes/");
  const shoppingListItemsRef = database.ref("shoppingList/shoppingListItems");

  return dispatch => {
    dispatch(removeShoppingListRecipeStarted());
    shoppingListRecipeRef
      .update({ [recipeId]: null })
      .then(() => shoppingListItemsRef.once("value"))
      .then(snapshot => {
        const shoppingListItemToRemove = filterIngredientsToRemove(recipeId, snapshot.val());
        return Promise.all(shoppingListItemToRemove.map(ingredient => shoppingListItemsRef.child(ingredient.ingredientId).remove()));
      })
      .then(() => dispatch(removeShoppingListRecipeFinished()))
      .then(() => dispatch(getShoppingList()))
      .catch(error => {
        console.log(error);
        return dispatch(removeShoppingListRecipeFailed());
      });
  };
};

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
  return dispatch => {
    dispatch(addIngredientsToShoppingListRequested());
    const shoppingListRecipesRef = database.ref("shoppingList/shoppingListRecipes/" + meal.recipeId);
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
