import { doSetRecipeSearch, recipeSearchReducer } from './searchBar-reducer';

describe('searchBar-reducer', () => {
  it('should create the correct action', function() {
    const searchTerm = 'tarte';

    const action = doSetRecipeSearch(searchTerm);
    const expectedAction = {
      type: 'RECIPE_SEARCH_SET',
      searchTerm
    };
    expect(action).toEqual(expectedAction);
  });

  it('should merge the right state through the reducer', function() {
    const previousState = 'tomate';

    const searchTerm = 'tarte';

    const action = {
      type: 'RECIPE_SEARCH_SET',
      searchTerm
    };

    const newState = recipeSearchReducer(previousState, action);
    const expectedNewState = 'tarte';
    expect(newState).toEqual(expectedNewState);
  });
});
