import { database } from "../../firebase";
import uuid from "uuid/v4";

//Actions
const ADD_RECIPE_REQUESTED = "ADD_RECIPE_REQUESTED";
export const ADD_RECIPE_FAILED = "ADD_RECIPE_FAILED";
export const ADD_RECIPE_SUCCEED = "ADD_RECIPE_SUCCEED";

export const GET_RECIPES_REQUESTED = "GET_RECIPES_REQUESTED";
export const GET_RECIPES_FAILED = "GET_RECIPES_FAILED";
export const GET_RECIPES_SUCCESS = "GET_RECIPES_SUCCESS";

//Action Creators
const addRecipeRequested = () => ({ type: ADD_RECIPE_REQUESTED });
const addRecipeFailed = () => ({ type: ADD_RECIPE_FAILED });
const addRecipeSucess = () => ({ type: ADD_RECIPE_SUCCEED });

const getRecipesRequested = () => ({ type: GET_RECIPES_REQUESTED });
const getRecipesFailed = () => ({ type: GET_RECIPES_FAILED });

export const getRecipesSuccess = recipes => {
  return {
    type: GET_RECIPES_SUCCESS,
    recipes,
    receivedAt: Date.now()
  };
};

//Reducer
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

// Side effects

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

export const getRecipes = () => {
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
};
