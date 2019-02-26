import { combineReducers } from 'redux';
import { categoryFilter } from '../CategoryFilter/categoryFilter-reducer';
import { recipesReducer } from '../Recipe/reducer/recipe-reducer';
import { shoppingList } from '../ShoppingList/reducer/shoppingList-reducer';
import sessionReducer from '../authentication/reducer/session-reducer';
import { userReducer } from '../authentication/reducer/user-reducer';
import { recipeSearchReducer } from '../SearchBar/searchBar-reducer';
import { apiFirebaseReducer } from '../apiFirebase/apiFirebase-reducer';

export const rootReducer = combineReducers({
  recipes: recipesReducer,
  categoryFilter,
  recipeSearchState: recipeSearchReducer,
  shoppingList,
  sessionState: sessionReducer,
  userState: userReducer,
  apiError: apiFirebaseReducer
});
