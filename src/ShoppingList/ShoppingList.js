import React from 'react';
import {
  branch,
  compose,
  lifecycle,
  renderComponent,
  renderNothing,
  withHandlers
} from 'recompose';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Delete from '@material-ui/icons/DeleteOutlined';
import {
  doFetchShoppingList,
  doRemoveShoppingListItem,
  removeShoppingListRecipe,
  doReOrderShoppingListItems,
  doToggleShoppingListItem
} from './reducer/shoppingList-reducer';
import { Box } from '../BasicComponents/Box';
import { AddCustomIngredient } from './AddCustomIngredient';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SignInWithFirebase } from '../authentication/SignInWithFireBaseUI';

export const ShoppingListItem = ({
  onClickHandler,
  ingredient,
  onRemoveHandler,
  index
}) => {
  return (
    <Draggable draggableId={ingredient.ingredientId} index={index}>
      {(provided, snapshot) => (
        <ShoppingListItemWrapper
          spaceBetween
          height={'40px'}
          purchased={ingredient.purchased}
          alignItems
          isDragging={snapshot.isDragging}
          width={'100%'}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          <Box
            onClick={() =>
              onClickHandler(ingredient.ingredientId, ingredient.purchased)
            }
          >
            {ingredient.name} {ingredient.quantity} {ingredient.measure}
          </Box>
          <Box
            right={'5px'}
            onClick={() => onRemoveHandler(ingredient.ingredientId)}
          >
            <Delete style={{ fontSize: 18 }} />
          </Box>
        </ShoppingListItemWrapper>
      )}
    </Draggable>
  );
};

export const ShoppingListRecipeCard = ({ meal, onRemoveHandler }) => (
  <Box width="100px" height="100px">
    <img
      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
      src={meal.uploadImageUrl}
      alt={meal.title}
    />
    <Box right={'5px'} onClick={() => onRemoveHandler(meal.recipeId)}>
      <Delete />
    </Box>
  </Box>
);

export const ShoppingListRecipe = ({ meal, onRemoveHandler }) => (
  <Box>
    <li key={meal.id}>
      {meal.title} - {meal.portion} portions
    </li>
    <Box right={'5px'} onClick={() => onRemoveHandler(meal.recipeId)}>
      <Delete />
    </Box>
  </Box>
);

const ShoppingListBase = ({
  shoppingList,
  onClickIngredientHandler,
  onRemoveIngredientHandler,
  onRemoveRecipeHandler,
  onDragEnd
}) => (
  <div>
    <h4>Recipe</h4>
    <Box spaceAround>
      {shoppingList.shoppingListRecipes.map(meal => (
        <ShoppingListRecipeCard
          key={meal.recipeId}
          meal={meal}
          onRemoveHandler={onRemoveRecipeHandler}
        />
      ))}
    </Box>
    <h4>Ingredients from recipes</h4>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={'recipeList-1'}>
        {provided => (
          <Box
            vertical
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
            {shoppingList.shoppingListItemsId.map(
              (shoppingListItemsId, index) => {
                const ingredient =
                  shoppingList.shoppingListItems[shoppingListItemsId];
                return (
                  <ShoppingListItem
                    key={ingredient.ingredientId}
                    ingredient={ingredient}
                    onClickHandler={onClickIngredientHandler}
                    onRemoveHandler={onRemoveIngredientHandler}
                    index={index}
                  />
                );
              }
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
    <AddCustomIngredient shoppingList={shoppingList} />
  </div>
);

const onDragEnd = ({ dispatch, shoppingList, uid }) => result => {
  const { destination, source, draggableId } = result;

  if (!destination) {
    return;
  }
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }
  const newShoppingListItemsId = Array.from(shoppingList.shoppingListItemsId);
  newShoppingListItemsId.splice(source.index, 1);
  newShoppingListItemsId.splice(destination.index, 0, draggableId);

  dispatch(doReOrderShoppingListItems(newShoppingListItemsId, uid));
};

const onRemoveIngredientHandler = ({
  dispatch,
  shoppingList,
  uid
}) => ingredientID => {
  const newShoppingListItemsId = shoppingList.shoppingListItemsId.filter(
    ingredient => ingredient !== ingredientID
  );
  return dispatch(
    doRemoveShoppingListItem(ingredientID, newShoppingListItemsId, uid)
  );
};

const onRemoveRecipeHandler = ({ dispatch, shoppingList, uid }) => recipeId => {
  const abc = _.pickBy(
    shoppingList.shoppingListItems,
    item => item.recipeId === recipeId
  );
  const shoppingListItemsToRemove = Object.keys(abc);

  const newShoppingListItemsId = shoppingList.shoppingListItemsId.filter(
    ingredientId => !shoppingListItemsToRemove.includes(ingredientId)
  );
  return dispatch(
    removeShoppingListRecipe(recipeId, newShoppingListItemsId, uid)
  );
};

export const ShoppingList = compose(
  connect(({ sessionState }) => ({
    uid: _.get(sessionState, 'authUser.uid')
  })),
  branch(({ uid }) => !uid, renderComponent(SignInWithFirebase)),
  lifecycle({
    componentDidMount() {
      this.props.dispatch(doFetchShoppingList(this.props.uid));
    }
  }),
  connect(state => ({ shoppingList: state.shoppingList })),
  withHandlers({
    onClickIngredientHandler: ({ dispatch, uid }) => {
      return (ingredientID, purchased) =>
        dispatch(doToggleShoppingListItem(ingredientID, purchased, uid));
    },
    onRemoveIngredientHandler: onRemoveIngredientHandler,
    onRemoveRecipeHandler: onRemoveRecipeHandler,
    onDragEnd: onDragEnd
  }),
  branch(({ shoppingList }) => !shoppingList.shoppingListItems, renderNothing)
)(ShoppingListBase);

const ShoppingListItemWrapper = styled(Box)`
  &:hover {
    cursor: pointer;
  }
  text-decoration: ${({ purchased }) => (purchased ? 'line-through' : 'none')};
  border-top: 1px solid lightgrey;
  border-bottom: ${({ isDragging }) =>
    isDragging ? '1px solid lightgrey' : 'none'};
  &:last-child {
    border-bottom: 1px solid lightgrey;
  }
  background-color: ${({ purchased }) => (purchased ? 'WhiteSmoke' : 'white')};
  color: ${({ purchased }) => (purchased ? 'LightGray' : 'black')};
`;
