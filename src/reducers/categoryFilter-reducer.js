import { SET_CATEGORY_FILTER } from "../actions";

export const categoryFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case SET_CATEGORY_FILTER:
      return action.category;
    default:
      return state;
  }
};
