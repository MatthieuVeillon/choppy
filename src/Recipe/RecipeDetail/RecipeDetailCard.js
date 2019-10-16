import withStyles from '@material-ui/core/es/styles/withStyles';
import TextField from '@material-ui/core/es/TextField/TextField';
import Typography from '@material-ui/core/es/Typography/Typography';
import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { compose } from 'recompose';
import styled from 'styled-components';
import { Box, Button } from '../../BasicComponents/Box';
import { recipesContext } from '../../Context/RecipesContext';
import { userContext } from '../../Context/UserContext';
import { database } from '../../firebase';
import { useShoppingListItems } from '../../ShoppingList/ShoppingList';
import { useFirebasePOSTApi } from '../useFirebaseApi';
import * as routes from '../../constants/routes';
import { useHistory } from 'react-router';

//########################################################
//                 ipeDetailCardHeader
//########################################################
const RecipeDetailCardHeader = ({
  canBeFrozen,
  cookingTime,
  pricePerPortion
}) => {
  return (
    <RecipeDetailCardHeaderContainer>
      <Box vertical>
        <Typography variant="subheading">{`Ingredients: add number`}</Typography>
        {canBeFrozen && (
          <Typography variant="subheading"> can be frozen</Typography>
        )}
      </Box>
      <Box vertical>
        <Typography variant="subheading">
          {' '}
          cooking Time : {cookingTime}
        </Typography>
        <Typography variant="subheading">
          {' '}
          portion price : {pricePerPortion}
        </Typography>
      </Box>
    </RecipeDetailCardHeaderContainer>
  );
};

//########################################################
//                 RecipeDetailIngredientList
//########################################################
const RecipeDetailIngredientList = ({ ingredients }) => (
  <RecipeDetailCardIngredientsContainer>
    <ul>
      {ingredients.map(ingredient => {
        return (
          <li key={ingredient.ingredientId}>
            <Typography variant="body2">
              {ingredient.quantity} {ingredient.measure} {ingredient.name}
            </Typography>
          </li>
        );
      })}
    </ul>
  </RecipeDetailCardIngredientsContainer>
);

//########################################################
//                 RecipeCookingSteps
//########################################################

const RecipeCookingSteps = ({ cookingSteps }) => (
  <RecipeDetailCardIngredientsContainer>
    <ul>
      {cookingSteps.map((step, index) => {
        return (
          <li key={index}>
            <Typography paragraph>{step.name}</Typography>
          </li>
        );
      })}
    </ul>
  </RecipeDetailCardIngredientsContainer>
);

//########################################################
//                 AddToShoppingListForm
//########################################################

const adjustIngredientsQuantityIfNeeded = (
  portion,
  defaultPortionNumber,
  ingredients,
  recipeId,
  title,
  uploadImageUrl
) => {
  let adjustedRecipe = {};
  let adjustedIngredients = [];
  const hasQuantityChanged = Number(portion) !== defaultPortionNumber;
  if (hasQuantityChanged) {
    adjustedIngredients = ingredients.map(ingredient => {
      return {
        ...ingredient,
        quantity:
          Number(ingredient.quantity) *
          (Number(portion) / Number(defaultPortionNumber))
      };
    });
  }
  adjustedRecipe.ingredientsWithQuantityUpdated = hasQuantityChanged
    ? adjustedIngredients
    : ingredients;
  adjustedRecipe.portion = Number(portion);
  adjustedRecipe.recipeId = recipeId;
  adjustedRecipe.title = title;
  adjustedRecipe.uploadImageUrl = uploadImageUrl;
  return { ...adjustedRecipe };
};

const extractIngredientFromRecipeAndFormatItforBD = recipe => {
  const concatIngredients = {};
  recipe.ingredientsWithQuantityUpdated.map(ingredient => {
    const ingredientIdentified = {
      [ingredient.ingredientId]: { ...ingredient, purchased: false }
    };
    return Object.assign(concatIngredients, ingredientIdentified);
  });
  return concatIngredients;
};

const prepareUpdatedShoppingList = (
  shoppingList,
  ingredientsFromRecipe,
  recipeId,
  recipeToSubmit
) => {
  const newShoppingListItems = {
    ..._.keyBy(shoppingList.shoppingListItems, 'ingredientId'),
    ...ingredientsFromRecipe
  };
  const newShoppingListItemsId = shoppingList.shoppingListItemsId.concat(
    Object.keys(ingredientsFromRecipe)
  );
  const updatedShoppingList = {};
  updatedShoppingList[`/shoppingListItems/`] = _.keyBy(
    newShoppingListItems,
    'ingredientId'
  ); //format for BD
  updatedShoppingList[`/shoppingListItemsId/`] = newShoppingListItemsId;
  updatedShoppingList[`/shoppingListRecipes/${recipeId}`] = recipeToSubmit;
  return updatedShoppingList;
};

export const AddToShoppingListForm = ({
  ingredients,
  defaultPortionNumber,
  uid,
  title,
  recipeId,
  uploadImageUrl
}) => {
  const [portion, updatePortion] = useState(defaultPortionNumber);
  const [shoppingList] = useShoppingListItems(uid);
  const history = useHistory();
  const recipeToSubmit = adjustIngredientsQuantityIfNeeded(
    portion,
    defaultPortionNumber,
    ingredients,
    recipeId,
    title,
    uploadImageUrl
  );
  const ingredientsFromRecipe = extractIngredientFromRecipeAndFormatItforBD(
    recipeToSubmit
  );
  const updatedShoppingList = prepareUpdatedShoppingList(
    shoppingList,
    ingredientsFromRecipe,
    recipeId,
    recipeToSubmit
  );
  debugger;
  const addRecipeIngredientsEndpoint = database.ref(`shoppingList/${uid}`);
  const [addRecipeIngredientsInDB] = useFirebasePOSTApi(
    addRecipeIngredientsEndpoint,
    updatedShoppingList,
    'UPDATE'
  );

  const onChangeHandler = event => updatePortion(event.target.value);

  const handleSubmit = event => {
    event.preventDefault();
    addRecipeIngredientsInDB();
    history.push(routes.SHOPPING_LIST);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        required
        id="number"
        label="Portion Number"
        value={portion}
        onChange={onChangeHandler}
        type="number"
        InputLabelProps={{
          shrink: true
        }}
        margin="normal"
      />
      <AddToShoppingListButton
        disabled={!uid}
        portion={portion}
        ingredients={ingredients}
        defaultPortionNumber={defaultPortionNumber}
      />
      {!uid && <p>Please login to use the shopping list feature</p>}
    </form>
  );
};

//########################################################
//                 AddToShoppingListButton
//########################################################

export const AddToShoppingListButtonBase = ({ classes, disabled }) => (
  <Button
    disabled={disabled}
    type="submit"
    className={classes.Button}
    variant="raised"
  >
    Add To Shopping Card
  </Button>
);

const styles = {
  Button: {
    width: 180,
    marginTop: '20px',
    alignSelf: 'center'
  }
};

export const AddToShoppingListButton = compose(withStyles(styles))(
  AddToShoppingListButtonBase
);

//########################################################
//                 recipeDetailCard
//########################################################
export const RecipeDetailCard = ({ match }) => {
  const { recipes } = useContext(recipesContext);
  const authUser = useContext(userContext);
  const recipeDisplayed = recipes.filter(
    recipe => recipe.recipeId === match.params.recipeId
  )[0];

  const {
    uploadImageUrl,
    title,
    canBeFrozen,
    cookingTime,
    pricePerPortion,
    ingredients,
    defaultPortionNumber,
    cookingSteps,
    recipeId
  } = recipeDisplayed;

  return (
    <RecipeDetailCardContainer>
      <div>
        <HeaderImage src={uploadImageUrl} />
      </div>
      <RecipeDetailCardHeader
        canBeFrozen={canBeFrozen}
        cookingTime={cookingTime}
        pricePerPortion={pricePerPortion}
      />
      <RecipeDetailCardBody>
        <div>
          <Typography variant="display1">{title}</Typography>
        </div>
        <div>
          <Typography variant="subheading">
            Ingredients {defaultPortionNumber}
          </Typography>
          <RecipeDetailIngredientList ingredients={ingredients} />
        </div>
        <RecipeCookingSteps cookingSteps={cookingSteps} />
      </RecipeDetailCardBody>
      {authUser ? (
        <AddToShoppingListForm
          defaultPortionNumber={defaultPortionNumber}
          ingredients={ingredients}
          title={title}
          recipeId={recipeId}
          uploadImageUrl={uploadImageUrl}
          uid={authUser.uid}
        />
      ) : null}
    </RecipeDetailCardContainer>
  );
};

const RecipeDetailCardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  > * {
    margin-top: 20px;
  }
`;

const RecipeDetailCardIngredientsContainer = styled.div`
  display: flex;
  border: 1px solid black;
  padding-right: 20px;
`;

const RecipeDetailCardHeaderContainer = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: blue;
  height: 50px;
  padding: 5px 0px;
  background-color: lightgrey;
`;

const RecipeDetailCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 600px;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: auto;
`;
