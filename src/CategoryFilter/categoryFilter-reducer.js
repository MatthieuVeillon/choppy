// Actions
export const CategoryFilter = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_VEGAN: "SHOW_VEGAN",
  SHOW_HEALTHY: "SHOW_HEALTHY"
};
export const SET_CATEGORY_FILTER = "SET_CATEGORY_FILTER";

//Action creator
export function setCategoryFilter(category) {
  return { type: SET_CATEGORY_FILTER, category };
}

//Reducer
export const categoryFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case SET_CATEGORY_FILTER:
      return action.category;
    default:
      return state;
  }
};
