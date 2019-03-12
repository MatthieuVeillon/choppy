import React from 'react';
import { Box, Button, FormField } from '../BasicComponents/Box';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Form } from '../BasicComponents/Form';
import { doPostCustomIngredientToShoppingList } from './reducer/shoppingList-reducer';
import { withRouter } from 'react-router';
import * as uuid from 'uuid';
import Add from '@material-ui/icons/AddCircleOutline';
import styled from 'styled-components';

export const AddCustomIngredientBase = ({ field, onChange, handleSubmit }) => (
  <Form horizontal onSubmit={handleSubmit} stretch>
    <FormField
      noborder
      borderBottom
      type="text"
      value={field}
      onChange={onChange}
      id="title"
      placeholder={'your own ingredient'}
      required
      width={'100%'}
    />
    <AddButton type="submit">
      <Add />
    </AddButton>
  </Form>
);

export const AddCustomIngredient = compose(
  connect(),
  withRouter,
  withState('field', 'setFieldValue', ''),
  withHandlers({
    onChange: ({ setFieldValue }) => e => {
      setFieldValue(e.target.value);
    }
  }),
  withProps(({ field }) => {
    let ingredient = {};
    ingredient.ingredientId = uuid();
    ingredient.purchased = false;
    ingredient.name = field;
    ingredient.recipeId = 'custom';
    return { ingredient };
  }),
  connect(({ sessionState }) => ({
    uid: sessionState.authUser.uid
  })),
  withHandlers({
    handleSubmit: ({
      dispatch,
      ingredient,
      history,
      setFieldValue,
      shoppingList,
      uid
    }) => e => {
      e.preventDefault();
      const newShoppingListItemsId = shoppingList.shoppingListItemsId.concat([
        ingredient.ingredientId
      ]);
      dispatch(
        doPostCustomIngredientToShoppingList(
          ingredient,
          newShoppingListItemsId,
          uid
        )
      );
      setFieldValue('');
    }
  })
)(AddCustomIngredientBase);

const AddButton = styled.button`
  padding: 0;
  margin: ;
  border: 0;
  border-bottom: 1px solid #ccc;
  background-color: transparent;
`;
