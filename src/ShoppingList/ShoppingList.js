import Delete from '@material-ui/icons/DeleteOutlined';
import { produce } from 'immer';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
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
import { database } from '../firebase';
import {
  useFirebaseGETApi,
  useFirebasePOSTApi
} from '../Recipe/useFirebaseApi';
import { AddCustomIngredient } from './AddCustomIngredient';
import {
  doFetchShoppingList,
  doRemoveShoppingListItem,
  doReOrderShoppingListItems,
  doToggleShoppingListItem
} from './reducer/shoppingList-reducer';

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
// should be able to batch them too

const isLastIngredientForItsRecipe = (shoppingListItems, recipeId) =>
  shoppingListItems.filter(item => item.recipeId === recipeId).count === 1;

export const ShoppingListItem = ({
  ingredient,
  index,
  uid,
  setShoppingList,
  shoppingList
}) => {
  //TODO change ingredient.IngredientID for ingredient.ID
  const { purchased, ingredientId, recipeId } = ingredient;
  const {
    shoppingListItems,
    shoppingListItemsId,
    shoppingListRecipes
  } = shoppingList;
  const isLastIngredient = isLastIngredientForItsRecipe(
    shoppingListItems,
    recipeId
  );

  const toggleIngredientPurchaseStatusEndpoint = database.ref(
    `shoppingList/${uid}/shoppingListItems/${ingredientId}/`
  );
  const [toggleIngredientPurchaseStatus] = useFirebasePOSTApi(
    toggleIngredientPurchaseStatusEndpoint,
    { purchased: !purchased },
    'UPDATE'
  );

  const updatedShoppingList = {};
  const shoppingListItemsToKeep = shoppingListItems.filter(
    item => item.ingredientId !== ingredientId
  );
  const shoppingListRecipesToKeep = shoppingListRecipes.filter(
    recipe => recipe.recipeId !== recipeId
  );
  const shoppingListItemsIdToKeep = shoppingListItemsId.filter(itemId =>
    shoppingListItemsToKeep.some(
      ingredient => ingredient.ingredientId === itemId
    )
  );

  if (isLastIngredient) {
    updatedShoppingList[`/shoppingListRecipes/${recipeId}`] = null;
  }

  updatedShoppingList[`/shoppingListItems/`] = _.keyBy(
    shoppingListItemsToKeep,
    'ingredientId'
  ); //format in BD is an object
  updatedShoppingList[`/shoppingListItemsId/`] = shoppingListItemsIdToKeep;
  const removeIngredientEndpoint = database.ref(`shoppingList/${uid}`);
  const [removeIngredientInDB] = useFirebasePOSTApi(
    removeIngredientEndpoint,
    updatedShoppingList,
    'UPDATE'
  );

  const onToggleIngredientPurchaseStatusHandler = () => {
    toggleIngredientPurchaseStatus();
    setShoppingList(
      produce(draft => {
        draft.shoppingListItems.forEach(item => {
          if (item.ingredientId === ingredient.ingredientId) {
            item.purchased = !ingredient.purchased;
          }
        });
      })
    );
  };

  const onRemoveIngredientHandler = isLastIngredient => {
    //what do I do if I'm the last ingredient of one recipe ?
    setShoppingList(
      produce(draft => {
        draft.shoppingListItemsId = shoppingListItemsIdToKeep;
        draft.shoppingListItems = shoppingListItemsToKeep;
        if (isLastIngredient) {
          draft.shoppingListRecipes = shoppingListRecipesToKeep;
        }
      })
    );
    removeIngredientInDB();
  };

  return (
    <Draggable key={ingredientId} draggableId={ingredientId} index={index}>
      {(provided, snapshot) => (
        <ShoppingListItemWrapper
          spaceBetween
          height={'40px'}
          purchased={purchased}
          alignItems
          isDragging={snapshot.isDragging}
          width={'100%'}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Box onClick={() => onToggleIngredientPurchaseStatusHandler()}>
            {ingredient.name} {ingredient.quantity} {ingredient.measure}
          </Box>
          <Box
            right={'5px'}
            onClick={() =>
              onRemoveIngredientHandler(
                isLastIngredientForItsRecipe(shoppingListItems, recipeId)
              )
            }
          >
            <Delete style={{ fontSize: 18 }} />
          </Box>
        </ShoppingListItemWrapper>
      )}
    </Draggable>
  );
};

const ShoppingListItemWrapper = styled(Box)`
  &:hover {
    cursor: pointer;
  }
  width: 100%;
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

//when I remove a recipe several things happens :

// 1) all ingredients that are associated with this recipe should be deleted from :
//  - shoppinglistItems
//  - shoppingListItemsId
//  and finally the recipe itself

export const ShoppingListRecipeCard = ({
  recipe,
  onRemoveHandler,
  userId,
  shoppingList,
  setShoppingList
}) => {
  const {
    shoppingListItemsId,
    shoppingListItems,
    shoppingListRecipes
  } = shoppingList;
  const { recipeId } = recipe;

  //UI SetUp
  const shoppingListItemsToKeep = shoppingListItems.filter(
    item => item.recipeId !== recipeId
  );
  const shoppingListItemsIdToKeep = shoppingListItemsId.filter(itemId =>
    shoppingListItemsToKeep.some(
      ingredient => ingredient.ingredientId === itemId
    )
  );
  const shoppingListRecipesToKeep = shoppingListRecipes.filter(
    recipe => recipe.recipeId !== recipeId
  );

  //BD SetUp
  const removeRecipeEndpoint = database.ref(`shoppingList/${userId}`);
  const updatedShoppingList = {};
  updatedShoppingList[`/shoppingListRecipes/${recipeId}`] = null;
  updatedShoppingList[`/shoppingListItems/`] = _.keyBy(
    shoppingListItemsToKeep,
    'ingredientId'
  ); //format in BD is an object
  updatedShoppingList[`/shoppingListItemsId/`] = shoppingListItemsIdToKeep;

  const [removeRecipeFromBD] = useFirebasePOSTApi(
    removeRecipeEndpoint,
    updatedShoppingList,
    'UPDATE'
  );

  //REFACTOR useFireBastePOSTAPI to just execute the endpoint regardless of type of operation (POST/PUT/remove)
  // return database
  // .ref(`shoppingList/${uid}//`)
  // .set(newShoppingListItemsId)

  const removeRecipeHandler = () => {
    //UI Optimistic Update
    setShoppingList(
      produce(draft => {
        draft.shoppingListItemsId = shoppingListItemsIdToKeep;
        draft.shoppingListItems = shoppingListItemsToKeep;
        draft.shoppingListRecipes = shoppingListRecipesToKeep;
      })
    );

    //remove recipe from DB
    removeRecipeFromBD();
  };
  return (
    <Box width="100px" height="100px">
      <img
        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        src={recipe.uploadImageUrl}
        alt={recipe.title}
      />
      <Box right={'5px'} onClick={() => removeRecipeHandler(recipe.recipeId)}>
        <Delete />
      </Box>
    </Box>
  );
};

export const ShoppingListRecipe = ({ recipe, onRemoveHandler }) => (
  <Box>
    <li key={recipe.id}>
      {recipe.title} - {recipe.portion} portions
    </li>
    <Box right={'5px'} onClick={() => onRemoveHandler(recipe.recipeId)}>
      <Delete />
    </Box>
  </Box>
);
//TODO refactor recipe.recipeId for just recipe.id
const RecipeList = ({ shoppingList, userId, setShoppingList }) => {
  const recipes = Object.keys(shoppingList.shoppingListRecipes).map(
    id => shoppingList.shoppingListRecipes[id]
  );
  return recipes.length > 0 ? (
    <React.Fragment>
      <h4>Recipe</h4>
      <Box spaceAround>
        {recipes.map(recipe => (
          <ShoppingListRecipeCard
            key={recipe.recipeId}
            recipe={recipe}
            userId={userId}
            shoppingList={shoppingList}
            setShoppingList={setShoppingList}
          />
        ))}
      </Box>
    </React.Fragment>
  ) : null;
};

const ShoppingListBase = ({
  shoppingList,
  setShoppingList,
  onRemoveIngredientHandler,
  onDragEnd,
  isInError,
  uid
}) => {
  return !shoppingList ? (
    <div>loading</div>
  ) : (
    <div>
      <RecipeList
        shoppingList={shoppingList}
        userId={uid}
        setShoppingList={setShoppingList}
      />
      <h4> Individual Ingredients </h4>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'recipeList-1'}>
          {provided => (
            <Box vertical ref={provided.innerRef} {...provided.droppableProps}>
              {shoppingList.shoppingListItemsId.map(
                (shoppingListItemsId, index) => {
                  const ingredient = _.find(
                    shoppingList.shoppingListItems,
                    item => {
                      return item.ingredientId === shoppingListItemsId;
                    }
                  );
                  return (
                    <ShoppingListItem
                      key={ingredient.ingredientId}
                      ingredient={ingredient}
                      onRemoveHandler={onRemoveIngredientHandler}
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
      <AddCustomIngredient
        shoppingList={shoppingList}
        uid={uid}
        setShoppingList={setShoppingList}
      />
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

export const transformDataForShoppingList = rawData => {
  const transformedData = {};

  const shoppingListItems = _.get(rawData, 'shoppingListItems')
    ? Object.keys(rawData.shoppingListItems).map(item => {
        return rawData.shoppingListItems[item];
      })
    : [];
  transformedData.shoppingListItems = shoppingListItems;

  const shoppingListRecipes = _.get(rawData, 'shoppingListRecipes')
    ? Object.keys(rawData.shoppingListRecipes).map(
        recipe => rawData.shoppingListRecipes[recipe]
      )
    : [];
  transformedData.shoppingListRecipes = shoppingListRecipes;

  transformedData.shoppingListItemsId = _.get(rawData, 'shoppingListItems')
    ? rawData.shoppingListItemsId
    : [];
  return transformedData;
};

export const useShoppingListItems = uid => {
  const endPoint = useCallback(
    () => database.ref(`/shoppingList/${uid}`).once('value'),
    [uid]
  );
  const [shoppingListFromDB, isInError, isLoading] = useFirebaseGETApi(
    endPoint,
    null,
    transformDataForShoppingList
  );
  const [shoppingList, setShoppingList] = useState(shoppingListFromDB);

  useEffect(() => {
    if (_.get(shoppingListFromDB, 'shoppingListItems')) {
      setShoppingList(shoppingListFromDB);
    }
  }, [shoppingListFromDB]);

  return [shoppingList, setShoppingList, isLoading, isInError];
};

export const ShoppingList = ({ authUser }) => {
  const [
    shoppingList,
    setShoppingList,
    isLoading,
    isInError
  ] = useShoppingListItems(authUser.uid);
  return (
    <ShoppingListBase
      shoppingList={shoppingList}
      setShoppingList={setShoppingList}
      uid={authUser.uid}
      isLoading={isLoading}
      isInError={isInError}
    />
  );
};
