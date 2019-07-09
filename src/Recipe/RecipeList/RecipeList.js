import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { recipesContext } from '../../Context/RecipesContext';
import { RecipeCard } from '../RecipeCard/RecipeCard';
import { searchAndFilter } from './utilsRecipe';

const LoadingComponent = () => <div>currently loading</div>;

export const RecipeList = ({ filter, searchTerm }) => {
  const { recipes, isLoading, isInError } = useContext(recipesContext);
  const filteredRecipes = searchAndFilter(recipes, filter, searchTerm);

  return isLoading ? (
    <LoadingComponent />
  ) : filteredRecipes.length > 0 ? (
    <RecipeHomeCardContainer data-testid="recipeList">
      {isInError && <div> In error </div>}
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
