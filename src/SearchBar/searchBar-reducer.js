// • action creators: doSomething
// • reducers: applySomething
// • selectors: getSomething
// • sagas: watchSomething, handleSomething

// Actions
export const RECIPE_SEARCH_SET = 'RECIPE_SEARCH_SET';

//Action creator
export function doSetRecipeSearch(searchTerm) {
  return { type: RECIPE_SEARCH_SET, searchTerm };
}

//Reducer
export const applySetRecipeSearch = (state, action) => action.searchTerm;

export const recipeSearchReducer = (state = '', action) => {
  switch (action.type) {
    case RECIPE_SEARCH_SET:
      return applySetRecipeSearch(state, action);
    default:
      return state;
  }
};
