import Add from '@material-ui/icons/AddCircleOutline';
import { produce } from 'immer';
import _ from 'lodash';
import React, { useState } from 'react';
import styled from 'styled-components';
import * as uuid from 'uuid';
import { FormField } from '../BasicComponents/Box';
import { Form } from '../BasicComponents/Form';
import { database } from '../firebase';
import { useFirebasePOSTApi } from '../Recipe/useFirebaseApi';

const makeNewIngredient = customIngredient => {
  const ingredient = {};
  ingredient.ingredientId = uuid();
  ingredient.purchased = false;
  ingredient.name = customIngredient;
  ingredient.recipeId = 'custom';
  return ingredient;
};

export const AddCustomIngredient = ({
  field,
  uid,
  shoppingList,
  setShoppingList
}) => {
  const [customIngredient, setCustomIngredient] = useState('');
  const newIngredient = makeNewIngredient(customIngredient);
  const addCustomIngredientEndpoint = database.ref(`shoppingList/${uid}`);

  const newShoppingListItems = [
    ...shoppingList.shoppingListItems,
    newIngredient
  ];
  const newShoppingListItemsId = shoppingList.shoppingListItemsId.concat([
    newIngredient.ingredientId
  ]);

  const updatedShoppingList = {};
  updatedShoppingList[`/shoppingListItems/`] = _.keyBy(
    newShoppingListItems,
    'ingredientId'
  ); //format for BD
  updatedShoppingList[`/shoppingListItemsId/`] = newShoppingListItemsId;

  const [addCustomIngredientInDB] = useFirebasePOSTApi(
    addCustomIngredientEndpoint,
    updatedShoppingList,
    'UPDATE'
  );

  const handleOnChange = e => setCustomIngredient(e.target.value);

  const handleOnSubmit = e => {
    e.preventDefault();

    //Optimistic UI Update
    setShoppingList(
      produce(draft => {
        draft.shoppingListItemsId = newShoppingListItemsId;
        draft.shoppingListItems = newShoppingListItems;
      })
    );

    setCustomIngredient('');

    addCustomIngredientInDB();
  };

  return (
    <Form horizontal onSubmit={handleOnSubmit} stretch>
      <FormField
        noborder
        borderBottom
        type="text"
        value={customIngredient}
        onChange={handleOnChange}
        placeholder={'your own ingredient'}
        required
        width={'100%'}
        data-testid="customIngredient"
      />
      <AddButton type="submit">
        <Add />
      </AddButton>
    </Form>
  );
};

const AddButton = styled.button`
  padding: 0;
  margin: ;
  border: 0;
  border-bottom: 1px solid #ccc;
  background-color: transparent;
`;
