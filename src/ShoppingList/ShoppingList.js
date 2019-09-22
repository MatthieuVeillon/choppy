import Delete from '@material-ui/icons/DeleteOutlined';
import { produce } from 'immer';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Box } from '../BasicComponents/Box';
import { database } from '../firebase';
import {
  useFirebaseGETApi,
  useFirebasePOSTApi
} from '../Recipe/useFirebaseApi';
import { AddCustomIngredient } from './AddCustomIngredient';

const isLastIngredientForItsRecipe = (shoppingListItems, recipeId) =>
  shoppingListItems.filter(item => item.recipeId === recipeId).length === 1;

export const ShoppingListItem = ({
  ingredient,
  index,
  uid,
  setShoppingList,
  shoppingList
}) => {
  //TODO change ingredient.IngredientID for ingredient.ID
  const { purchased, ingredientId, recipeId } = ingredient;
  const { shoppingListItems } = shoppingList;
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

  const {
    updatedShoppingList,
    shoppingListItemsIdToKeep,
    shoppingListItemsToKeep,
    shoppingListRecipesToKeep
  } = prepareUpdatedShoppingList(
    shoppingList,
    ingredientId,
    recipeId,
    isLastIngredient
  );
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
            data-testid={`remove${ingredient.name}`}
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

    removeRecipeFromBD();
  };
  return (
    <Box width="100px" height="100px">
      <img
        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
        src={recipe.uploadImageUrl}
        alt={recipe.title}
      />
      <Box
        data-testId={`remove${recipeId}`}
        right={'5px'}
        onClick={() => removeRecipeHandler(recipe.recipeId)}
      >
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
  const initialState = React.useMemo(() => {
    return {
      shoppingListItems: [],
      shoppingListItemsId: [],
      shoppingListRecipes: []
    };
  }, []);
  const endPoint = useCallback(
    () => database.ref(`/shoppingList/${uid}`).once('value'),
    [uid]
  );
  const [
    shoppingList,
    isInError,
    isLoading,
    setShoppingList
  ] = useFirebaseGETApi(endPoint, initialState, transformDataForShoppingList);
  return [shoppingList, setShoppingList, isLoading, isInError];
};

export const ShoppingList = ({ authUser }) => {
  const uid = authUser.uid;
  const [shoppingList, setShoppingList, isLoading] = useShoppingListItems(
    authUser.uid
  );
  const onDragEnd = result => {
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

    database
      .ref(`shoppingList/${uid}/shoppingListItemsId/`)
      .set(newShoppingListItemsId)
      .catch(error => {
        console.log(error);
      });

    setShoppingList(
      produce(draft => {
        draft.shoppingListItemsId = newShoppingListItemsId;
      })
    );
  };

  return isLoading ? (
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
            <Box
              data-testid="shoppingList"
              vertical
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
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
function prepareUpdatedShoppingList(
  shoppingList,
  ingredientId,
  recipeId,
  isLastIngredient
) {
  const updatedShoppingList = {};
  const {
    shoppingListItems,
    shoppingListItemsId,
    shoppingListRecipes
  } = shoppingList;
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
  return {
    updatedShoppingList,
    shoppingListItemsIdToKeep,
    shoppingListItemsToKeep,
    shoppingListRecipesToKeep
  };
}
