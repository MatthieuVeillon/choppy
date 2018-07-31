import { connect } from "react-redux";
import _ from "lodash";
import { RecipeDetailCard } from "./RecipeDetailCard";

const mapStateToProps = (state, ownProps) => {
  return {
    recipeDisplayed: _.find(state.recipes.recipes, ["recipeId", ownProps.match.params.recipeId])
  };
};

export default connect(mapStateToProps, null)(RecipeDetailCard);
