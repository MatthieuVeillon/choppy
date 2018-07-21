import React from "react";
import styled from "styled-components";
import { branch, compose, renderNothing, withHandlers, withProps, withState } from "recompose";
import { FlexDivColumn } from "./CssComponents";
import { Button, TextField, Typography } from "material-ui";
import { withStyles } from "material-ui/styles";
import { connect } from "react-redux";
import { addIngredientsToShoppingList } from "../actions";
import { withRouter } from "react-router-dom";

//########################################################
//                 RecipeDetailCardHeader
//########################################################
const RecipeDetailCardHeader = ({ canBeFrozen, cookingTime, pricePerPortion }) => {
  return (
    <RecipeDetailCardHeaderContainer>
      <FlexDivColumn>
        <Typography variant="subheading">{`Ingredients: add number`}</Typography>
        {canBeFrozen && <Typography variant="subheading"> can be frozen</Typography>}
      </FlexDivColumn>
      <FlexDivColumn>
        <Typography variant="subheading"> cooking Time : {cookingTime}</Typography>
        <Typography variant="subheading"> portion price : {pricePerPortion}</Typography>
      </FlexDivColumn>
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
          <li>
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
      {cookingSteps.map(step => {
        return (
          <li>
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
export const AddToShoppingListFormBase = ({
  handleSubmit,
  portion,
  onChangeHandler,
  ingredients,
  defaultPortionNumber
}) => (
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
    />;
    <AddToShoppingListButton
      portion={portion}
      ingredients={ingredients}
      defaultPortionNumber={defaultPortionNumber}
    />
  </form>
);

export const AddToShoppingListForm = compose(
  withState("portion", "updatePortion", ({ defaultPortionNumber }) => defaultPortionNumber),
  withHandlers({
    onChangeHandler: ({ updatePortion }) => event => updatePortion(event.target.value)
  }),
  withProps(({ portion, defaultPortionNumber, ingredients, recipeId, title }) => {
    let meal = {};
    let newIngredients = [];
    const quantityChanged = Number(portion) !== defaultPortionNumber;
    if (quantityChanged) {
      newIngredients = ingredients.map(ingredient => {
        return {
          ...ingredient,
          ...{
            quantity: Number(ingredient.quantity) * (Number(portion) / Number(defaultPortionNumber))
          }
        };
      });
    }
    meal.ingredientsWithQuantityUpdated = quantityChanged ? newIngredients : ingredients;
    meal.portion = Number(portion);
    meal.recipeId = recipeId;
    meal.title = title;
    console.log("ici meal", meal);
    return { meal };
  }),
  withProps(({ meal }) => {
    console.log("in withProps", meal);
    return {};
  }),

  connect(),
  withRouter,
  withHandlers({
    handleSubmit: ({ meal, dispatch, history }) => event => {
      console.log("mealInHandler", meal);
      event.preventDefault();
      return dispatch(addIngredientsToShoppingList(meal, () => history.push("/")));
    }
  })
)(AddToShoppingListFormBase);

//########################################################
//                 AddToShoppingListButton
//########################################################

export const AddToShoppingListButtonBase = ({ classes }) => (
  <Button type="submit" className={classes.Button} variant="raised">
    Add To Shopping Card
  </Button>
);

const styles = {
  Button: {
    width: 180,
    marginTop: "20px",
    alignSelf: "center"
  }
};

export const AddToShoppingListButton = compose(withStyles(styles))(AddToShoppingListButtonBase);

//########################################################
//                 recipeDetailCard
//########################################################
const RecipeDetailCardBase = ({
  recipeDisplayed: {
    uploadImageUrl,
    title,
    canBeFrozen,
    cookingTime,
    pricePerPortion,
    ingredients,
    defaultPortionNumber,
    cookingSteps,
    recipeId
  }
}) => (
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
        <Typography variant="subheading">Ingredients {defaultPortionNumber}</Typography>
        <RecipeDetailIngredientList ingredients={ingredients} />
      </div>
      <RecipeCookingSteps cookingSteps={cookingSteps} />
    </RecipeDetailCardBody>
    <AddToShoppingListForm
      defaultPortionNumber={defaultPortionNumber}
      ingredients={ingredients}
      title={title}
      recipeId={recipeId}
    />
  </RecipeDetailCardContainer>
);

export const RecipeDetailCard = compose(
  branch(({ recipeDisplayed }) => !recipeDisplayed, renderNothing)
)(RecipeDetailCardBase);

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
