import React from "react";
import { branch, compose, lifecycle, renderNothing, withHandlers } from "recompose";
import { connect } from "react-redux";
import styled from "styled-components";
import ClosedIcon from "@material-ui/icons/Close";
import { getShoppingList, removeShoppingListItem, removeShoppingListRecipe, selectShoppingListItem } from "./reducer/shoppingList-reducer";
import { Box } from "../BasicComponents/Box";

export const ShoppingListItem = ({ onClickHandler, ingredient, onRemoveHandler }) => {
  return (
    <Box>
      <ShoppingListItemWrapper
        width={"300px"}
        height={"40px"}
        debug
        alignItems
        isPurchased={ingredient.purchased}
        onClick={() => onClickHandler(ingredient.ingredientId, ingredient.purchased)}
      >
        {ingredient.name} {ingredient.quantity} {ingredient.measure}
      </ShoppingListItemWrapper>
      <Box alignItems onClick={() => onRemoveHandler(ingredient.ingredientId)}>
        <ClosedIcon />
      </Box>
    </Box>
  );
};

export const ShoppingListRecipe = ({ meal, onRemoveHandler }) => (
  <FlexWrapper>
    <li key={meal.id}>
      {meal.title} - {meal.portion} portions
    </li>
    <FlexWrapper onClick={() => onRemoveHandler(meal.recipeId)}>
      <ClosedIcon />
    </FlexWrapper>
  </FlexWrapper>
);

const ShoppingListBase = ({ shoppingList, onClickIngredientHandler, onRemoveIngredientHandler, onRemoveRecipeHandler }) => (
  <div>
    <ul>
      {shoppingList.shoppingListRecipes.map(meal => (
        <ShoppingListRecipe key={meal.recipeId} meal={meal} onRemoveHandler={onRemoveRecipeHandler} />
      ))}
    </ul>
    {shoppingList.shoppingListItems.map(ingredient => (
      <ShoppingListItem
        key={ingredient.ingredientId}
        ingredient={ingredient}
        onClickHandler={onClickIngredientHandler}
        onRemoveHandler={onRemoveIngredientHandler}
      />
    ))}
  </div>
);

export const ShoppingList = compose(
  connect(),
  lifecycle({
    componentDidMount() {
      return this.props.dispatch(getShoppingList());
    }
  }),
  connect(state => ({ shoppingList: state.shoppingList })),
  withHandlers({
    onClickIngredientHandler: ({ dispatch }) => (ingredientID, isPurchased) => dispatch(selectShoppingListItem(ingredientID, isPurchased)),
    onRemoveIngredientHandler: ({ dispatch }) => ingredientID => dispatch(removeShoppingListItem(ingredientID)),
    onRemoveRecipeHandler: ({ dispatch }) => recipeId => dispatch(removeShoppingListRecipe(recipeId))
  }),
  branch(({ shoppingList }) => !shoppingList.shoppingListItems, renderNothing)
)(ShoppingListBase);

const ShoppingListItemWrapper = styled(Box)`
  display: flex;
  background-color: AliceBlue;
  margin-bottom: 1px;
  &:hover {
    cursor: pointer;
  }
  text-decoration: ${({ isPurchased }) => (isPurchased ? "line-through" : "none")};
`;

const FlexWrapper = styled.div`
  display: flex;
`;

// Objectifs de la page shoppingList

/*
- La page garde en mémoire les items cochés. Donc dans le state redux et la BD
- Idéalement j'aimerai mapper tous les ingrédients depuis le même array
- il me faut un moyen sur et unique d'identifier ces ingrédient pour les barrer et / ou remove du array
- j'envoie la liste des ingrédients au fur et à mesure de manière individuelle à chaque fois que l'utilisateur envoie des ingrédients

*/
