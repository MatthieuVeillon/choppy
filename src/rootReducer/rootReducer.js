import { combineReducers } from "redux";
import { categoryFilter } from "../CategoryFilter/categoryFilter-reducer";
import { recipes } from "../Recipe/reducer/recipe-reducer";
import { shoppingList } from "../ShoppingList/reducer/shoppingList-reducer";
import sessionReducer from "../authentication/reducer/session-reducer";

export const rootReducer = combineReducers({
  recipes,
  categoryFilter,
  shoppingList,
  sessionState: sessionReducer
});
