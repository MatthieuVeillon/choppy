import React from 'react';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Box } from '../../BasicComponents/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

export const recipeCard = ({
  title,
  uploadImageUrl,
  recipeId,
  canBeFrozen,
  cookingTime,
  pricePerPortion,
  navigateTo
}) => {
  return (
    <Box onClick={navigateTo} vertical shadow bottom="20px">
      <Box width="200px" height="200px">
        <img
          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          src={uploadImageUrl}
          alt={{ title }}
        />
      </Box>
      <Box height="60px" top="10px" vertical>
        <Box
          margin={'3px'}
          alignItems
          spaceAround
          style={{ fontWeight: 'bold' }}
        >
          {title}
        </Box>
        <Box margin={'3px'} top="10px" spaceAround>
          <Box alignItems>
            <FontAwesomeIcon icon={faClock} className={'fa-fw'} />
            {cookingTime} min
          </Box>
          <Box alignItems>{pricePerPortion} $</Box>
          {canBeFrozen && (
            <Box alignItems>
              <FontAwesomeIcon icon={faSnowflake} pull={'right'} />
            </Box>
          )}
        </Box>
      </Box>
      <Box />
    </Box>
  );
};

export const RecipeCard = compose(
  withRouter,
  withHandlers({
    navigateTo: ({ history, recipeId }) => () =>
      history.push(`/recipe/${recipeId}`)
  })
)(recipeCard);
