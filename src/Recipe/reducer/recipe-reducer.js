import { database } from '../../firebase';
import uuid from 'uuid/v4';
import { FIREBASE_API } from '../../apiFirebase/apiFirebase-reducer';

//Actions
export const ADD_RECIPE_FAILED = 'ADD_RECIPE_FAILED';
export const RECIPES_ALL_SET = 'RECIPES_ALL_SET';
export const RECIPE_NEW_SET = 'RECIPE_NEW_SET';

export const GET_RECIPES_REQUESTED = 'GET_RECIPES_REQUESTED';
export const GET_RECIPES_FAILED = 'GET_RECIPES_FAILED';
export const GET_RECIPES_SUCCESS = 'GET_RECIPES_SUCCESS';

//Action Creators
export const doSetAllRecipes = data => ({
  type: RECIPES_ALL_SET,
  payload: {
    data: data
  }
});

export const doSetNewRecipe = recipe => ({
  type: RECIPE_NEW_SET,
  payload: {
    data: recipe
  }
});

//Apply functions for reducers

export const applySetAllRecipes = (state, action) => {
  return {
    ...state,
    recipes: Object.keys(action.payload.data).map(k => action.payload.data[k])
  };
};

export const applySetNewRecipe = (state, action) => {
  return {
    ...state
    //recipes: state.recipes.concat(action.payload.data)
  };
};

//Reducer
export const recipesReducer = (state = [], action) => {
  switch (action.type) {
    case RECIPES_ALL_SET:
      return applySetAllRecipes(state, action);
    case RECIPE_NEW_SET:
      return applySetNewRecipe(state, action);
    default:
      return state;
  }
};

export const addIdToRecipeAndIngredients = (recipe, key) => {
  recipe.recipeId = key;
  recipe.ingredients.forEach(ingredient => {
    ingredient.ingredientId = uuid();
    ingredient.recipeId = key;
  });
  return recipe;
};

export const doPostRecipe = (recipe, navigateToHome) => {
  let key = database.ref('/recipes/').push().key;
  const recipesRef = database.ref('/recipes/' + key);
  const recipeWithId = addIdToRecipeAndIngredients(recipe, key);
  return {
    type: FIREBASE_API,
    payload: {
      firebaseType: 'POST',
      firebaseMethod: () => recipesRef.set(recipeWithId),
      onSuccess: () => navigateToHome()
    }
  };
};

export const doFetchAllRecipes = () => {
  const ref = database.ref(`/recipes`);
  return {
    type: FIREBASE_API,
    payload: {
      firebaseType: 'GET',
      firebaseMethod: () => ref.once('value'),
      onSuccess: doSetAllRecipes
    }
  };
};
