import { combineReducers } from "redux";
import { categoryFilter } from "../CategoryFilter/categoryFilter-reducer";
import { recipes } from "../Recipe/reducer/recipe-reducer";
import { shoppingList } from "../ShoppingList/reducer/shoppingList-reducer";

export const rootReducer = combineReducers({
  recipes,
  categoryFilter,
  shoppingList
});
