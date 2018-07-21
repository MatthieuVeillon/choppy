import { connect } from "react-redux";
import { RecipeList } from "../components/RecipeList";

const getVisibleRecipes = (recipes, category) => {
  switch (category) {
    case "SHOW_VEGAN":
      return recipes.filter(recipe => recipe.categories.vegan);
    case "SHOW_HEALTHY":
      return recipes.filter(recipe => recipe.categories.healthy);
    case "SHOW_ALL":
    default:
      return recipes;
  }
};

const mapStateToProps = state => {
  return {
    recipes: getVisibleRecipes(state.recipes.recipes, state.categoryFilter)
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     onTodoClick: id => {
//       dispatch(toggleTodo(id));
//     }
//   };
// };

const VisibleRecipeList = connect(mapStateToProps)(RecipeList);

export default VisibleRecipeList;
