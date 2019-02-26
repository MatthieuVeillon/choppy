import { database } from '../../firebase';
import _ from 'lodash';
import { FIREBASE_API } from '../../apiFirebase/apiFirebase-reducer';

//Actions
export const ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED =
  'ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED';
export const SHOPPING_LIST_SET = 'SHOPPING_LIST_SET';
export const REMOVE_SHOPPING_LIST_RECIPE_FINISHED =
  'REMOVE_SHOPPING_LIST_RECIPE_FINISHED';
export const SHOPPING_LIST_ITEM_REORDERED_SET =
  'SHOPPING_LIST_ITEM_REORDERED_SET';
export const SHOPPING_LIST_ITEM_TOGGLE = 'SHOPPING_LIST_ITEM_TOGGLE';

export const SHOPPING_LIST_ITEM_REMOVE_FROM_STATE =
  'SHOPPING_LIST_ITEM_REMOVE_FROM_STATE';

// Action Creators

export const doRemoveShoppingListRecipe = () => ({
  type: REMOVE_SHOPPING_LIST_RECIPE_FINISHED
});

export const addCustomIngredientsToShoppingListCompleted = ingredient => ({
  type: ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED,
  ingredient
});

export const doSetReorderShoppingListItem = newShoppingListItemsId => ({
  type: SHOPPING_LIST_ITEM_REORDERED_SET,
  newShoppingListItemsId
});

export const doFetchShoppingList = uid => {
  const ref = database.ref(`/shoppingList/${uid}`);
  return {
    type: FIREBASE_API,
    payload: {
      firebaseType: 'GET',
      firebaseMethod: () => ref.once('value'),
      onSuccess: doSetShoppingList
    }
  };
};

export const doSetShoppingList = shoppingList => ({
  type: SHOPPING_LIST_SET,
  payload: {
    shoppingList
  }
});

export const applySetShoppingList = (action, state) => {
  const shoppingListItems = _.get(
    action,
    'payload.shoppingList.shoppingListItems'
  );
  const shoppingListItemsId = _.get(
    action,
    'payload.shoppingList.shoppingListItemsId'
  );
  const shoppingListRecipes = _.get(
    action,
    'payload.shoppingList.shoppingListRecipes'
  );
  return {
    ...state,
    shoppingListItems: shoppingListItems ? shoppingListItems : {},
    shoppingListItemsId: shoppingListItemsId ? shoppingListItemsId : [],
    shoppingListRecipes: shoppingListRecipes
      ? Object.keys(shoppingListRecipes).map(item => shoppingListRecipes[item])
      : []
  };
};

export const doToggleShoppingListItemInState = ({
  ingredientID,
  purchased
}) => ({
  type: SHOPPING_LIST_ITEM_TOGGLE,
  payload: {
    ingredientID,
    purchased
  }
});

export const applyToggleShoppingListItem = (action, state) => ({
  ...state,
  shoppingListItems: {
    ...state.shoppingListItems,
    [action.payload.ingredientID]: {
      ...state.shoppingListItems[action.payload.ingredientID],
      purchased: !action.payload.purchased
    }
  }
});

export const doToggleShoppingListItem = (ingredientID, purchased, uid) => {
  const shoppingListItemRef = database.ref(
    `shoppingList/${uid}/shoppingListItems/${ingredientID}/`
  );
  return {
    type: FIREBASE_API,
    payload: {
      firebaseType: 'POST',
      firebaseMethod: () =>
        shoppingListItemRef.update({ purchased: !purchased }),
      data: { ingredientID, purchased },
      onSuccess: () =>
        doToggleShoppingListItemInState({ ingredientID, purchased })
    }
  };
};

//TODO  implement the get selected item status instead of asking for the whole shoppinglist each time we update the purchase status
// export const GET_SELECTED_ITEM_STATUS_STARTED = "GET_SELECTED_ITEM_STATUS_STARTED";
// export const GET_SELECTED_ITEM_STATUS_FINISHED = "GET_SELECTED_ITEM_STATUS_FINISHED";
// export const GET_SELECTED_ITEM_STATUS_FAILED = "GET_SELECTED_ITEM_STATUS_FAILED";

// nested reducer
export const customIngredient = (state, action) => {
  switch (action.type) {
    case ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED:
      return { ...state, [action.ingredient.ingredientId]: action.ingredient };
    default:
      return state;
  }
};

//TODO finish last appliers
export const shoppingList = (state = {}, action) => {
  switch (action.type) {
    case ADD_CUSTOM_INGREDIENTS_SHOPPING_LIST_SUCCEED:
      return {
        ...state,
        shoppingListItems: customIngredient(state.shoppingListItems, action)
      };
    case SHOPPING_LIST_SET:
      return applySetShoppingList(action, state);
    case SHOPPING_LIST_ITEM_TOGGLE:
      return applyToggleShoppingListItem(action, state);
    case SHOPPING_LIST_ITEM_REMOVE_FROM_STATE:
      return applyRemoveShoppingListItem(state, action);
    case SHOPPING_LIST_ITEM_REORDERED_SET:
      return {
        ...state,
        shoppingListItemsId: action.newShoppingListItemsId
      };
    default:
      return state;
  }
};

// Side Effects
export const filterIngredientsToRemove = (recipeId, shoppingListItems) => {
  const shoppingListItemsArray = _.values(shoppingListItems);
  return _.filter(
    shoppingListItemsArray,
    ingredient => ingredient.recipeId === recipeId
  );
};

const doRemoveAllIngredientsFromRecipe = (snapshot, recipeId, uid) => {
  const shoppingListItemToRemove = filterIngredientsToRemove(
    recipeId,
    snapshot.val()
  );
  return Promise.all(
    shoppingListItemToRemove.map(ingredient =>
      database
        .ref(`shoppingList/${uid}/shoppingListItems/`)
        .child(ingredient.ingredientId)
        .remove()
    )
  );
};

export const removeShoppingListRecipe = (
  recipeId,
  newShoppingListItemsId,
  uid
) => {
  return dispatch => {
    database
      .ref(`shoppingList/${uid}/shoppingListRecipes/`)
      .update({ [recipeId]: null })
      .then(() =>
        database.ref(`shoppingList/${uid}/shoppingListItems/`).once('value')
      )
      .then(snapshot =>
        doRemoveAllIngredientsFromRecipe(snapshot, recipeId, uid)
      )
      .then(() => dispatch(doRemoveShoppingListRecipe()))
      .then(() =>
        dispatch(doReOrderShoppingListItems(newShoppingListItemsId, uid))
      )
      .then(() => dispatch(doFetchShoppingList(uid)))
      .catch(error => {
        console.log(error);
      });
  };
};

//TODO refactor for API middleware
export const doRemoveShoppingListItem = (
  ingredientID,
  newShoppingListItemsId,
  uid
) => {
  return dispatch => {
    // 1) do remove one ingredient from the shoppingListItem => doRemoveShoppingListItem
    // 2) do replace all the shoppingListItemsId by the new oneprovided by the client
    // 3) do fetchShoppingList for this user to get all the changes
    //TODO - fix this hack, each ingredient removed should only be responsible to remove its parent recipe if the ingredient is the last one not all recipesReducer.
    // also we shouldnt fetch the shopping List once more from the DB, we juste need to clear the state accordingly
    if (newShoppingListItemsId.length === 0) {
      dispatch(doRemoveAllRecipesfromShoppingList(uid));
    }
    dispatch(doSetReorderShoppingListItem(newShoppingListItemsId));
    removeShoppingListIngredientFromDB(uid, ingredientID)
      .then(() => setNewShoppingListItemsIdInDB(uid, newShoppingListItemsId))
      .then(() => dispatch(doRemoveShoppingListItemFromState(uid)))
      .catch(error => {
        console.log(error);
      });
  };
};

const doRemoveAllRecipesfromShoppingList = uid => {
  const shoppingListRef = database.ref(
    `shoppingList/${uid}/shoppingListRecipes/`
  );
  return {
    type: FIREBASE_API,
    payload: {
      firebaseType: 'POST',
      firebaseMethod: () => shoppingListRef.set(null),
      onSuccess: () => doFetchShoppingList(uid)
    }
  };
};

export const applyRemoveShoppingListItem = (state, action) => {
  return {
    ...state,
    shoppingListItems: {
      ..._.omit(state.shoppingListItems, [action.ingredientID])
    },
    shoppingListItemsId: state.shoppingListItemsId.filter(
      id => id !== action.ingredientID
    )
  };
};

export const doRemoveShoppingListItemFromState = ingredientID => ({
  type: SHOPPING_LIST_ITEM_REMOVE_FROM_STATE,
  ingredientID
});

const removeShoppingListIngredientFromDB = (uid, ingredientID) =>
  database
    .ref(`shoppingList/${uid}/shoppingListItems/`)
    .update({ [ingredientID]: null });

const setNewShoppingListItemsIdInDB = (uid, newShoppingListItemsId) =>
  database
    .ref(`shoppingList/${uid}/shoppingListItemsId/`)
    .set(newShoppingListItemsId);

const concatAllIngredientsIntoOneList = meal => {
  const concatIngredients = {};
  meal.ingredientsWithQuantityUpdated.map(ingredient => {
    const ingredientIdentified = {
      [ingredient.ingredientId]: { ...ingredient, purchased: false }
    };
    return Object.assign(concatIngredients, ingredientIdentified);
  });
  return concatIngredients;
};

//TODO - tests
export const doPostCustomIngredientToShoppingList = (
  meal,
  newShoppingListItemsId,
  uid
) => {
  const shoppingListRef = database.ref(
    `shoppingList/${uid}/shoppingListItems/${meal.ingredientId}`
  );
  return {
    type: FIREBASE_API,
    payload: {
      firebaseType: 'POST',
      firebaseMethod: () => shoppingListRef.update(meal),
      onSuccess: () => [
        addCustomIngredientsToShoppingListCompleted(meal),
        doReOrderShoppingListItems(newShoppingListItemsId, uid)
      ]
    }
  };
};

export const allShoppingListItemsId = (
  shoppingListItems,
  newShoppingListItems
) => {
  if (shoppingListItems) {
    return _.union(shoppingListItems, newShoppingListItems);
  }
  return newShoppingListItems;
};

//TODO refactor for API middleware
export const addIngredientsToShoppingList = (
  meal,
  shoppingListItemsId,
  uid,
  navigateToShoppingList
) => {
  return dispatch => {
    // 1) prepare the ingredient into one manageable list
    // 2) update the recipeList with the recipe
    // 3) update the shoppingListItems list with all the ingredients themselves
    // 4) update the shoppingListItemsId to keep the order of the new ingredients added

    const ingredientList = concatAllIngredientsIntoOneList(meal);
    const shoppingListRecipesRef = database.ref(
      `shoppingList/${uid}/shoppingListRecipes/` + meal.recipeId
    );
    shoppingListRecipesRef
      .update(meal)
      .then(() =>
        database
          .ref(`shoppingList/${uid}/shoppingListItems/`)
          .update(ingredientList)
      )
      .then(() =>
        database
          .ref(`shoppingList/${uid}/shoppingListItemsId/`)
          .set(
            allShoppingListItemsId(
              shoppingListItemsId,
              Object.keys(ingredientList)
            )
          )
      )
      .then(() => navigateToShoppingList())
      .catch(error => {
        console.log(error);
      });
  };
};

//not through API middleware as I need to dispactch the state update before the API call is completed otherwise user will see a refresh glitch
export const doReOrderShoppingListItems = (newShoppingListItemsId, uid) => {
  return dispatch => {
    dispatch(doSetReorderShoppingListItem(newShoppingListItemsId));
    return database
      .ref(`shoppingList/${uid}/shoppingListItemsId/`)
      .set(newShoppingListItemsId)
      .catch(error => {
        console.log(error);
      });
  };
};
