import React from "react";
import { branch, compose, lifecycle, renderNothing, withHandlers, withState } from "recompose";
import {} from "../actions";
import { connect } from "react-redux";
import styled from "styled-components";
import _ from "lodash";
import { getShoppingList } from "../actions";

const ShoppingListBase = ({ shoppingList, onClickHandler }) => {
  return (
    <div>
      <ul>
        {shoppingList.shoppingListRecipes.map(meal => (
          <li>
            {meal.title} {meal.portion}
          </li>
        ))}
      </ul>
      <ul>
        {shoppingList.shoppingListItems.map((ingredient, index) => (
          <li>
            <div style={{ backgroundColor: "green" }} onClick={() => onClickHandler(ingredient.ingredientId)}>
              {" "}
              {ingredient.name} {ingredient.quantity} {ingredient.measure}
            </div>{" "}
            <button>remove item</button>
          </li>
        ))}
      </ul>
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
    onClickHandler: ({}) => ingredientID => {
      return console.log(ingredientID);
    }
  }),
  branch(({ shoppingList }) => !shoppingList.shoppingListItems, renderNothing)
)(ShoppingListBase);

// Objectifs de la page shoppingList

/*
- La page garde en mémoire les items cochés. Donc dans le state redux et la BD
- Idéalement j'aimerai mapper tous les ingrédients depuis le même array
- il me faut un moyen sur et unique d'identifier ces ingrédient pour les barrer et / ou remove du array
- j'envoie la liste des ingrédients au fur et à mesure de manière individuelle à chaque fois que l'utilisateur envoie des ingrédients

*/
