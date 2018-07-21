import { combineReducers } from "redux";
import { categoryFilter } from "./categoryFilter-reducer";
import { recipes } from "./recipes-reducer";
import { shoppingList } from "./shoppingList-reducer";

export const recipeApp = combineReducers({
  recipes,
  categoryFilter,
  shoppingList
});
