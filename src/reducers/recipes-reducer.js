import {
  ADD_RECIPE_FAILED,
  ADD_RECIPE_REQUESTED,
  ADD_RECIPE_SUCCEED,
  GET_RECIPES_REQUESTED,
  GET_RECIPES_SUCCESS,
  GET_RECIPES_FAILED
} from "../actions";

export const recipes = (state = [], action) => {
  switch (action.type) {
    case ADD_RECIPE_REQUESTED:
      return {
        ...state,
        inProgress: true,
        error: "",
        success: ""
      };
    case ADD_RECIPE_FAILED:
      return {
        ...state,
        inProgress: false,
        error: "Error in adding recipes"
      };
    case ADD_RECIPE_SUCCEED:
      return {
        ...state,
        inProgress: false,
        success: "Added recipe"
      };
    case GET_RECIPES_REQUESTED:
      return {
        ...state,
        inProgress: true,
        error: "",
        success: ""
      };
    case GET_RECIPES_FAILED:
      return {
        ...state,
        inProgress: false,
        error: "Error in getting recipes"
      };
    case GET_RECIPES_SUCCESS:
      return {
        ...state,
        recipes: Object.keys(action.recipes).map(k => action.recipes[k]),
        lastUpdated: action.receivedAt,
        inProgress: false,
        success: "Got recipes"
      };
    default:
      return state;
  }
};
