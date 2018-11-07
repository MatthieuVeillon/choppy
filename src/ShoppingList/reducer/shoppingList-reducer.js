import { database } from "../../firebase/index";
import _ from "lodash";

//Actions
export const ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED = "ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED";
export const ADD_INGREDIENTS_SHOPPING_LIST_FAILED = "ADD_INGREDIENTS_SHOPPING_LIST_FAILED";
export const ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED = "ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED";

export const ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_REQUESTED = "ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_REQUESTED";
export const ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_FAILED = "ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_FAILED";
export const ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED = "ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED";

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

export const REORDER_SHOPPING_LIST_ITEM_STARTED = "REORDER_SHOPPING_LIST_ITEM_STARTED";
export const REORDER_SHOPPING_LIST_ITEM_FAILED = "REORDER_SHOPPING_LIST_ITEM_FAILED";
export const REORDER_SHOPPING_LIST_ITEM_FINISHED = "REORDER_SHOPPING_LIST_ITEM_FINISHED";

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
const getShoppingListSucceed = shoppingList => ({
    type: GET_SHOPPING_LIST_SUCCEED,
    shoppingList,
    receivedAt: Date.now()
});
export const addIngredientsToShoppingListRequested = () => ({ type: ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED });
export const addIngredientsToShoppingListFailed = () => ({ type: ADD_INGREDIENTS_SHOPPING_LIST_FAILED });
export const addIngredientsToShoppingListCompleted = ingredient => ({
    type: ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED,
    ingredient
});

export const addCustomIngredientsToShoppingListRequested = () => ({
  type: ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_REQUESTED
});
export const addCustomIngredientsToShoppingListFailed = () => ({ type: ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_FAILED });
export const addCustomIngredientsToShoppingListCompleted = ingredient => ({
    type: ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED,
    ingredient
});

export const reOrderShoppingListItemStarted = () => ({ type: REORDER_SHOPPING_LIST_ITEM_STARTED });
export const reOrderShoppingListItemFailed = () => ({ type: REORDER_SHOPPING_LIST_ITEM_FAILED });
export const reOrderShoppingListItemFinished = newShoppingListItemsId => ({
    type: REORDER_SHOPPING_LIST_ITEM_FINISHED,
    newShoppingListItemsId
});

//TODO  implement the get selected item status instead of asking for the whole shoppinglist each time we update the pruchase status
// export const GET_SELECTED_ITEM_STATUS_STARTED = "GET_SELECTED_ITEM_STATUS_STARTED";
// export const GET_SELECTED_ITEM_STATUS_FINISHED = "GET_SELECTED_ITEM_STATUS_FINISHED";
// export const GET_SELECTED_ITEM_STATUS_FAILED = "GET_SELECTED_ITEM_STATUS_FAILED";

// reducer

export const customIngredient = (state, action) => {
  switch (action.type) {
    case ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED:
      return { ...state, [action.ingredient.ingredientId]: action.ingredient };
    default:
      return state;
  }
};

export const shoppingList = (state = {}, action) => {
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
    case ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED:
      return {
        ...state,
        shoppingListItems: customIngredient(state.shoppingListItems, action),
        inProgress: false,
        success: "Added custom ingredient to shopping List in DB and in state"
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
      const shoppingListItems = action.shoppingList ? action.shoppingList.shoppingListItems : {};
      const shoppingListItemsId = action.shoppingList ? action.shoppingList.shoppingListItemsId : [];
      const shoppingListRecipes = action.shoppingList ? action.shoppingList.shoppingListRecipes : [];

      return {
        ...state,
        shoppingListItems: shoppingListItems !== null ? shoppingListItems : {},
        shoppingListItemsId: shoppingListItemsId !== null ? shoppingListItemsId : [],
        shoppingListRecipes: shoppingListRecipes !== null ? Object.keys(shoppingListRecipes).map(item => shoppingListRecipes[item]) : [],
        lastUpdated: action.receivedAt,
        inProgress: false,
        success: "Got shoppingList"
      };

    case REORDER_SHOPPING_LIST_ITEM_FAILED:
      return {
        ...state,
        inProgress: false,
        error: "Error in reordering shoppingItems"
      };
    case REORDER_SHOPPING_LIST_ITEM_FINISHED:
      return {
        ...state,
        shoppingListItemsId: action.newShoppingListItemsId,
        inProgress: false,
        error: "reordering completed"
      };

    default:
      return state;
  }
};

// Side Effects

const ref = {
  shoppingListRecipes: database.ref("shoppingList/shoppingListRecipes/"),
  shoppingListItems: database.ref("shoppingList/shoppingListItems/"),
  shoppingListItemsId: database.ref("shoppingList/shoppingListItemsId/")
};

export const filterIngredientsToRemove = (recipeId, shoppingListItems) => {
  const shoppingListItemsArray = _.values(shoppingListItems);
  return _.filter(shoppingListItemsArray, ingredient => ingredient.recipeId === recipeId);
};

export const removeShoppingListRecipe = (recipeId, newShoppingListItemsId) => {
  return dispatch => {
    dispatch(removeShoppingListRecipeStarted());

    ref.shoppingListRecipes
      .update({ [recipeId]: null })
      .then(() => ref.shoppingListItems.once("value"))
      .then(snapshot => {
        const shoppingListItemToRemove = filterIngredientsToRemove(recipeId, snapshot.val());
        return Promise.all(shoppingListItemToRemove.map(ingredient => ref.shoppingListItems.child(ingredient.ingredientId).remove()));
      })
      .then(() => dispatch(removeShoppingListRecipeFinished()))
      .then(() => dispatch(reOrderShoppingListItems(newShoppingListItemsId)))
      .then(() => dispatch(getShoppingList()))
      .catch(error => {
        console.log(error);
        return dispatch(removeShoppingListRecipeFailed());
      });
  };
};

export const removeShoppingListItem = (ingredientID, newShoppingListItemsId) => {
  return dispatch => {
    dispatch(removeShoppingListItemStarted());

    //TODO - fix this hack, each ingredient removed should only be responsible to remove its parent recipe if the ingredient is the last one not all recipes
    if (newShoppingListItemsId.length === 0) {
      ref.shoppingListRecipes.set(null);
    }
    dispatch(reOrderShoppingListItemFinished(newShoppingListItemsId));
    ref.shoppingListItems
      .update({ [ingredientID]: null })
      .then(() => ref.shoppingListItemsId.set(newShoppingListItemsId))
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

export const addCustomIngredientsToShoppingList = (meal, navigateToShoppingList, newShoppingListItemsId) => {
  return dispatch => {
    dispatch(addCustomIngredientsToShoppingListRequested());
    const shoppingListRef = database.ref(`shoppingList/shoppingListItems/${meal.ingredientId}`);
    shoppingListRef
      .update(meal)
      .then(() => ref.shoppingListItemsId.set(newShoppingListItemsId))
      .then(() => dispatch(addCustomIngredientsToShoppingListCompleted(meal)))
      .then(() => dispatch(reOrderShoppingListItemFinished(newShoppingListItemsId)))
      .then(() => navigateToShoppingList())
      .catch(error => {
        console.log(error);
        return dispatch(addCustomIngredientsToShoppingListFailed());
      });
  };
};

export const allShoppingListItemsId = (shoppingListItems, newShoppingListItems) => {
  if (shoppingListItems) {
    return _.union(shoppingListItems, newShoppingListItems);
  }
  return newShoppingListItems;
};

export const addIngredientsToShoppingList = (meal, shoppingListItemsId, navigateToShoppingList) => {
  return dispatch => {
    dispatch(addIngredientsToShoppingListRequested());
    const ingredientList = concatAllIngredientsIntoOneList(meal);
    const shoppingListRecipesRef = database.ref("shoppingList/shoppingListRecipes/" + meal.recipeId);
    shoppingListRecipesRef
      .update(meal)
      .then(() => ref.shoppingListItems.update(ingredientList))
      .then(() => ref.shoppingListItemsId.set(allShoppingListItemsId(shoppingListItemsId, Object.keys(ingredientList))))
      .then(() => dispatch(addIngredientsToShoppingListCompleted()))
      .then(() => navigateToShoppingList())
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

export const reOrderShoppingListItems = newShoppingListItemsId => {
  return dispatch => {
    dispatch(reOrderShoppingListItemFinished(newShoppingListItemsId));
    return ref.shoppingListItemsId.set(newShoppingListItemsId).catch(error => {
      console.log(error);
      dispatch(reOrderShoppingListItemFailed());
    });
  };
};
