import React from "react";
import { branch, compose, lifecycle, renderNothing, withHandlers } from "recompose";
import { connect } from "react-redux";
import styled from "styled-components";
import { getShoppingList, removeShoppingListItem, removeShoppingListRecipe, selectShoppingListItem } from "./reducer/shoppingList-reducer";

export const ShoppingListItem = ({ onClickHandler, ingredient, onRemoveHandler }) => {
  return (
    <FlexWrapper>
      <ShoppingListItemBox isPurchased={ingredient.purchased} onClick={() => onClickHandler(ingredient.ingredientId, ingredient.purchased)}>
        {ingredient.name} {ingredient.quantity} {ingredient.measure}
      </ShoppingListItemBox>
      <button onClick={() => onRemoveHandler(ingredient.ingredientId)}> - </button>
    </FlexWrapper>
  );
};

export const ShoppingListRecipe = ({ meal, onRemoveHandler }) => (
  <FlexWrapper>
    <li key={meal.id}>
      {meal.title} - {meal.portion} portions
    </li>
    <button onClick={() => onRemoveHandler(meal.recipeId)}>-</button>
  </FlexWrapper>
);

const ShoppingListBase = ({ shoppingList, onClickIngredientHandler, onRemoveIngredientHandler, onRemoveRecipeHandler }) => {
  return (
    <div>
      <ul>
        {shoppingList.shoppingListRecipes.map(meal => (
          <ShoppingListRecipe index={meal.recipeId} meal={meal} onRemoveHandler={onRemoveRecipeHandler} />
        ))}
      </ul>
      {shoppingList.shoppingListItems.map(ingredient => (
        <ShoppingListItem
          index={ingredient.ingredientId}
          ingredient={ingredient}
          onClickHandler={onClickIngredientHandler}
          onRemoveHandler={onRemoveIngredientHandler}
        />
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
    onClickIngredientHandler: ({ dispatch }) => (ingredientID, isPurchased) => dispatch(selectShoppingListItem(ingredientID, isPurchased)),
    onRemoveIngredientHandler: ({ dispatch }) => ingredientID => dispatch(removeShoppingListItem(ingredientID)),
    onRemoveRecipeHandler: ({ dispatch }) => recipeId => dispatch(removeShoppingListRecipe(recipeId))
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
