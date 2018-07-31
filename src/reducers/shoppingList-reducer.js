import {
  ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED,
  ADD_INGREDIENTS_SHOPPING_LIST_FAILED,
  ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED,
  GET_SHOPPING_LIST_SUCCEED,
  GET_SHOPPING_LIST_REQUESTED,
  GET_SHOPPING_LIST_FAILED
} from "../actions";

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
        shoppingListItems: Object.keys(action.shoppingList.shoppingListItems).map(item => action.shoppingList.shoppingListItems[item]),
        shoppingListRecipes: Object.keys(action.shoppingList.shoppingListRecipes).map(
          item => action.shoppingList.shoppingListRecipes[item]
        ),
        lastUpdated: action.receivedAt,
        inProgress: false,
        success: "Got shoppingList"
      };
    default:
      return state;
  }
};
