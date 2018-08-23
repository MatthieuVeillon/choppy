import React from "react";
import { branch, compose, lifecycle, renderNothing, withHandlers } from "recompose";
import { connect } from "react-redux";
import { getShoppingList, removeShoppingListItem, selectShoppingListItem } from "../actions";
import styled from "styled-components";

export const ShoppingListItem = ({ onClickHandler, ingredient, onRemoveHandler }) => {
  return (
    <FlexWrapper>
      <ShoppingListItemBox
        isPurchased={ingredient.purchased}
        onClick={() => onClickHandler(ingredient.ingredientId, ingredient.purchased)}
      >
        {ingredient.name} {ingredient.quantity} {ingredient.measure}
      </ShoppingListItemBox>
      <button onClick={() => onRemoveHandler(ingredient.ingredientId)}> - </button>
    </FlexWrapper>
  );
};

export const ShoppingListRecipe = ({ meal }) => (
  <FlexWrapper>
    <li key={meal.id}>
      {meal.title} - {meal.portion} portions
    </li>
    <button>-</button>
  </FlexWrapper>
);

const ShoppingListBase = ({ shoppingList, onClickHandler, onRemoveHandler }) => {
  return (
    <div>
      <ul>
        {shoppingList.shoppingListRecipes.map(meal => (
          <ShoppingListRecipe meal={meal} />
        ))}
      </ul>
      {shoppingList.shoppingListItems.map(ingredient => (
        <ShoppingListItem ingredient={ingredient} onClickHandler={onClickHandler} onRemoveHandler={onRemoveHandler} />
      ))}
    </div>
  );
};

export const ShoppingList = compose(
  connect(),
  lifecycle({
    componentDidMount() {
      return this.props.dispatch(getShoppingList());
    }
  }),
  connect(state => ({ shoppingList: state.shoppingList })),
  withHandlers({
    onClickHandler: ({ dispatch }) => (ingredientID, isPurchased) =>
      dispatch(selectShoppingListItem(ingredientID, isPurchased)),
    onRemoveHandler: ({ dispatch }) => ingredientID => dispatch(removeShoppingListItem(ingredientID))
  }),
  branch(({ shoppingList }) => !shoppingList.shoppingListItems, renderNothing)
)(ShoppingListBase);

const ShoppingListItemBox = styled.div`
  display: flex;
  background-color: AliceBlue;
  width: 300px;
  height: 40px;
  margin-bottom: 1px;
  align-items: center;

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
