import Delete from '@material-ui/icons/DeleteOutlined';
import _ from 'lodash';
import { database } from '../firebase';
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { produce } from 'immer';
import {
  branch,
  compose,
  lifecycle,
  renderNothing,
  withHandlers,
  withProps
} from 'recompose';
import styled from 'styled-components';
import { Box } from '../BasicComponents/Box';
import { AddCustomIngredient } from './AddCustomIngredient';
import {
  doFetchShoppingList,
  doRemoveShoppingListItem,
  doReOrderShoppingListItems,
  doToggleShoppingListItem,
  removeShoppingListRecipe
} from './reducer/shoppingList-reducer';
import {
  useFirebaseGETApi,
  useFirebasePOSTApi
} from '../Recipe/useFirebaseApi';

// to remove ingredient I'm gonna do an optimistic update of the UI (UI state change before, DB change and then display error message if any):
// I need 2 endpoints and 2 state update
// endpoints :
//  - Remove ingredient from Shopping.ShoppingListItems
//  - Remove ingredient from Shopping.ShoppingListItemsID
//  Can I batch the 2 updates through the same endpoint update ?
//
// state update :
//  - Remove ingredient from Shopping.ShoppingListItems
//  - Remove ingredient from Shopping.ShoppingListItemsID
// should be able to nbatch them too

export const ShoppingListItem = ({
  ingredient,
  onRemoveHandler,
  index,
  uid,
  setShoppingList
}) => {
  //TODO change ingredient.IngredientID for ingredient.ID
  const toggleIngredientPurchaseStatusEndpoint = database.ref(
    `shoppingList/${uid}/shoppingListItems/${ingredient.ingredientId}/`
  );
  const [toggleIngredientPurchaseStatus] = useFirebasePOSTApi(
    toggleIngredientPurchaseStatusEndpoint,
    { purchased: !ingredient.purchased },
    'UPDATE'
  );
  const removeIngredientFromShoppingListEndpoint = database.ref(
    `shoppingList/${uid}/`
  );
  const [removeIngredientFromShoppingList] = useFirebasePOSTApi(
    removeIngredientFromShoppingListEndpoint,
    {}
  );

  const onRemoveHandler2 = () => {
    const ingredientID = ingredient.ingredientId;

    //   const updateObj = {
    //   const updateObj = {
    //     `shoppingListItems.${ingredient.ingredientId}`: null,
    //     shoppingListItemsId[ingredient.ingredientId]: null
    //   };
  };

  const onClickHandler = () => {
    toggleIngredientPurchaseStatus();
    setShoppingList(
      produce(draft => {
        draft.shoppingListItems[
          ingredient.ingredientId
        ].purchased = !ingredient.purchased;
      })
    );
  };

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
          <Box onClick={() => onClickHandler()}>
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

const RecipeList = ({ shoppingList }) => {
  //TODO change null and the way I burn recipes in the state when I get the data from the DB - see applySetShoppingList
  const recipes = null;
  return recipes ? (
    <React.Fragment>
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
    </React.Fragment>
  ) : null;
};

const ShoppingListBase = ({
  shoppingList,
  setShoppingList,
  onClickIngredientHandler,
  onRemoveIngredientHandler,
  onRemoveRecipeHandler,
  onDragEnd,
  uid
}) => {
  return shoppingList.length === 0 ? (
    <div>loading</div>
  ) : (
    <div>
      <RecipeList shoppingList={shoppingList} />
      <h4> Individual Ingredients </h4>
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
                      onRemoveHandler={onRemoveIngredientHandler}
                      onClickIngredientHandler={onClickIngredientHandler}
                      setShoppingList={setShoppingList}
                      shoppingList={shoppingList}
                      index={index}
                      uid={uid}
                    />
                  );
                }
              )}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <AddCustomIngredient shoppingList={shoppingList} uid={uid} />
    </div>
  );
};

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

const useShoppingListItems = uid => {
  const endPoint = useCallback(
    () => database.ref(`/shoppingList/${uid}`).once('value'),
    [uid]
  );
  const [shoppingListFromDB, isInError, isLoading] = useFirebaseGETApi(
    endPoint,
    []
  );
  const [shoppingList, setShoppingList] = useState(shoppingListFromDB);
  useEffect(() => {
    if (shoppingListFromDB) {
      setShoppingList(shoppingListFromDB);
    }
  }, [shoppingListFromDB]);
  return [shoppingList, setShoppingList];
};

export const ShoppingList = ({ authUser }) => {
  const [shoppingList, setShoppingList] = useShoppingListItems(authUser.uid);
  return (
    <ShoppingListBase
      shoppingList={shoppingList}
      setShoppingList={setShoppingList}
      uid={authUser.uid}
    />
  );
};

export const ShoppingList2 = compose(
  connect(),
  withProps(({ authUser }) => ({
    uid: authUser.uid
  })),
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
