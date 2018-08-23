import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import {connect} from "react-redux";

export const RecipeList = ({ recipes }) =>
  recipes ? (
    <RecipeHomeCardContainer>
      {recipes.map(recipe => <RecipeCard key={recipe.recipeId} {...recipe} />)}
    </RecipeHomeCardContainer>
  ) : null;

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      canBeFrozen: PropTypes.bool.isRequired,
      categories: PropTypes.object.isRequired,
      cookingSteps: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
      cookingTime: PropTypes.string.isRequired,
      defaultPortionNumber: PropTypes.string.isRequired,
      ingredients: PropTypes.arrayOf(
        PropTypes.shape({
          ingredientId: PropTypes.string,
          measure: PropTypes.string,
          name: PropTypes.string,
          quantity: PropTypes.string
        })
      ).isRequired,
      pricePerPortion: PropTypes.string.isRequired,
      recipeId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      uploadImageUrl: PropTypes.string.isRequired
    }).isRequired
  )
};

const RecipeHomeCardContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`;


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


export const VisibleRecipeList = connect(mapStateToProps)(RecipeList);
