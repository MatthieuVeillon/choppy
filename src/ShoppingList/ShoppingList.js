import React from "react";
import { branch, compose, lifecycle, renderComponent, renderNothing, withHandlers } from "recompose";
import _ from "lodash";
import { connect } from "react-redux";
import styled from "styled-components";
import ClosedIcon from "@material-ui/icons/Close";
import {
  getShoppingList,
  removeShoppingListItem,
  removeShoppingListRecipe,
  reOrderShoppingListItems,
  selectShoppingListItem
} from "./reducer/shoppingList-reducer";
import { Box } from "../BasicComponents/Box";
import { AddCustomIngredient } from "./AddCustomIngredient";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SignInWithFirebase } from "../authentication/SignInWithFireBaseUI";

export const ShoppingListItem = ({ onClickHandler, ingredient, onRemoveHandler, index }) => {
  return (
    <Draggable draggableId={ingredient.ingredientId} index={index}>
      {provided => (
        <Box {...provided.draggableProps} {...provided.dragHandleProps} innerRef={provided.innerRef}>
          <ShoppingListItemWrapper
            width={"300px"}
            height={"40px"}
            alignItems
            shadow
            border
            isPurchased={ingredient.purchased}
            onClick={() => onClickHandler(ingredient.ingredientId, ingredient.purchased)}
          >
            {ingredient.name} {ingredient.quantity} {ingredient.measure}
          </ShoppingListItemWrapper>
          <Box alignItems onClick={() => onRemoveHandler(ingredient.ingredientId)}>
            <ClosedIcon />
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export const ShoppingListRecipe = ({ meal, onRemoveHandler }) => (
  <Box>
    <li key={meal.id}>
      {meal.title} - {meal.portion} portions
    </li>
    <Box onClick={() => onRemoveHandler(meal.recipeId)}>
      <ClosedIcon />
    </Box>
  </Box>
);

const ShoppingListBase = ({ shoppingList, onClickIngredientHandler, onRemoveIngredientHandler, onRemoveRecipeHandler, onDragEnd }) => (
  <div>
    <h4>Recipe</h4>
    <ul>
      {shoppingList.shoppingListRecipes.map(meal => (
        <ShoppingListRecipe key={meal.recipeId} meal={meal} onRemoveHandler={onRemoveRecipeHandler} />
      ))}
    </ul>
    <h4>Ingredients from recipes</h4>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={"recipeList-1"}>
        {provided => (
          <Box vertical innerRef={provided.innerRef} {...provided.droppableProps}>
            {shoppingList.shoppingListItemsId.map((shoppingListItemsId, index) => {
              const ingredient = shoppingList.shoppingListItems[shoppingListItemsId];
              return (
                <ShoppingListItem
                  key={ingredient.ingredientId}
                  ingredient={ingredient}
                  onClickHandler={onClickIngredientHandler}
                  onRemoveHandler={onRemoveIngredientHandler}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
    <h4> Custom ingredients </h4>
    <AddCustomIngredient shoppingList={shoppingList} />
  </div>
);

const onDragEnd = ({ dispatch, shoppingList, uid }) => result => {
  const { destination, source, draggableId } = result;

  if (!destination) {
    return;
  }
  if (destination.droppableId === source.droppableId && destination.index === source.index) {
    return;
  }
  const newShoppingListItemsId = Array.from(shoppingList.shoppingListItemsId);
  newShoppingListItemsId.splice(source.index, 1);
  newShoppingListItemsId.splice(destination.index, 0, draggableId);

  dispatch(reOrderShoppingListItems(newShoppingListItemsId, uid));
};

const onRemoveIngredientHandler = ({ dispatch, shoppingList, uid }) => ingredientID => {
  const newShoppingListItemsId = shoppingList.shoppingListItemsId.filter(ingredient => ingredient !== ingredientID);
  return dispatch(removeShoppingListItem(ingredientID, newShoppingListItemsId, uid));
};

const onRemoveRecipeHandler = ({ dispatch, shoppingList, uid }) => recipeId => {
  const abc = _.pickBy(shoppingList.shoppingListItems, item => item.recipeId === recipeId);
  const shoppingListItemsToRemove = Object.keys(abc);

  const newShoppingListItemsId = shoppingList.shoppingListItemsId.filter(ingredientId => !shoppingListItemsToRemove.includes(ingredientId));
  return dispatch(removeShoppingListRecipe(recipeId, newShoppingListItemsId, uid));
};

export const ShoppingList = compose(
  connect(({ sessionState }) => ({
    uid: _.get(sessionState, "authUser.uid")
  })),
  branch(({ uid }) => !uid, renderComponent(SignInWithFirebase)),
  lifecycle({
    componentDidMount() {
      this.props.dispatch(getShoppingList(this.props.uid));
    }
  }),
  connect(state => ({ shoppingList: state.shoppingList })),
  withHandlers({
    onClickIngredientHandler: ({ dispatch, uid }) => (ingredientID, isPurchased) =>
      dispatch(selectShoppingListItem(ingredientID, isPurchased, uid)),
    onRemoveIngredientHandler: onRemoveIngredientHandler,
    onRemoveRecipeHandler: onRemoveRecipeHandler,
    onDragEnd: onDragEnd
  }),
  branch(({ shoppingList }) => !shoppingList.shoppingListItems, renderNothing)
)(ShoppingListBase);

const ShoppingListItemWrapper = styled(Box)`
  margin-bottom: 3px;
  &:hover {
    cursor: pointer;
  }
  text-decoration: ${({ isPurchased }) => (isPurchased ? "line-through" : "none")};
  background-color: white;
`;
