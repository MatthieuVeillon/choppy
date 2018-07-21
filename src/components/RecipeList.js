import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { RecipeCard } from "./RecipeCard";

export const RecipeList = ({ recipes }) =>
  recipes ? (
    <RecipeHomeCardContainer>
      {recipes.map(recipe => <RecipeCard key={recipe.recipeId} {...recipe} />)}
    </RecipeHomeCardContainer>
  ) : null;

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      uploadImageUrl: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

const RecipeHomeCardContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`;
