import {
  ADD_INGREDIENTS_SHOPPING_LIST_SUCCEED,
  ADD_INGREDIENTS_SHOPPING_LIST_FAILED,
  ADD_INGREDIENTS_SHOPPING_LIST_REQUESTED,
  GET_SHOPPING_LIST_SUCCEED,
  GET_SHOPPING_LIST_REQUESTED,
  GET_SHOPPING_LIST_FAILED
} from "../actions";

export const concatAllIngredientsIntoOneList = shoppingList => {
  const concatIngredients = [];
  shoppingList.map(meal => meal.ingredientsWithQuantityUpdated.map(ingredient => concatIngredients.push(ingredient)));
  return concatIngredients;
};

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
      const shoppingListRecipesArray = Object.keys(action.shoppingList).map(k => action.shoppingList[k]);
      const shoppingListAllIngredients = concatAllIngredientsIntoOneList(shoppingListRecipesArray);

      let newState = {
        ...state,
        datafromRecipes: shoppingListRecipesArray,
        shoppingListAllIngredients: shoppingListAllIngredients,
        lastUpdated: action.receivedAt,
        inProgress: false,
        success: "Got recipes"
      };
      return newState;
    default:
      return state;
  }
};
