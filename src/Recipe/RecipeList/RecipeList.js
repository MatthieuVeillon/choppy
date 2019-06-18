import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { RecipeCard } from '../RecipeCard/RecipeCard';
import { GlobalContext } from '../../App';
import { searchAndFilter } from './utilsRecipe';
import { recipesContext } from '../../Context/RecipesContext';

export const RecipeList = ({ filter, searchTerm }) => {
  const { recipes } = useContext(recipesContext);
  const filteredRecipes = searchAndFilter(recipes, filter, searchTerm);

  return filteredRecipes.length > 0 ? (
    <RecipeHomeCardContainer>
      {filteredRecipes.map(recipe => (
        <RecipeCard key={recipe.recipeId} {...recipe} />
      ))}
    </RecipeHomeCardContainer>
  ) : null;
};

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      canBeFrozen: PropTypes.bool.isRequired,
      categories: PropTypes.object.isRequired,
      cookingSteps: PropTypes.arrayOf(
        PropTypes.shape({ name: PropTypes.string })
      ).isRequired,
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
