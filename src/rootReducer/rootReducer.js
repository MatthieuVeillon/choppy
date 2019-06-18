import { combineReducers } from 'redux';
import { recipesReducer } from '../Recipe/reducer/recipe-reducer';
import { shoppingList } from '../ShoppingList/reducer/shoppingList-reducer';
import { apiFirebaseReducer } from '../apiFirebase/apiFirebase-reducer';

export const rootReducer = combineReducers({
  recipes: recipesReducer,
  shoppingList,
  apiError: apiFirebaseReducer
});
