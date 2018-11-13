import React from "react";
import { Box, Button, FormField } from "../BasicComponents/Box";
import { connect } from "react-redux";
import { compose, withHandlers, withProps, withState } from "recompose";
import { Form } from "../BasicComponents/Form";
import { addCustomIngredientsToShoppingList } from "./reducer/shoppingList-reducer";
import { withRouter } from "react-router";
import * as uuid from "uuid";
import * as routes from "../constants/routes";

export const AddCustomIngredientBase = ({ field, onChange, handleSubmit }) => (
  <Box>
    <Form onSubmit={handleSubmit}>
      <FormField type="text" value={field} onChange={onChange} id="title" placeholder={"your own ingredient"} required width="250px" />
      <Button primary type="submit" top="10px">
        ADD INGREDIENT
      </Button>
    </Form>
  </Box>
);

export const AddCustomIngredient = compose(
  connect(),
  withRouter,
  withState("field", "setFieldValue", ""),
  withHandlers({
    onChange: props => e => {
      props.setFieldValue(e.target.value);
    }
  }),
  withProps(({ field }) => {
    let ingredient = {};
    ingredient.ingredientId = uuid();
    ingredient.purchased = false;
    ingredient.name = field;
    ingredient.recipeId = "custom";
    return { ingredient };
  }),
  connect(({ sessionState }) => ({
    uid: sessionState.authUser.uid
  })),
  withHandlers({
    handleSubmit: ({ dispatch, ingredient, history, setFieldValue, shoppingList, uid }) => e => {
      e.preventDefault();

      const newShoppingListItemsId = shoppingList.shoppingListItemsId.concat([ingredient.ingredientId]);

      dispatch(addCustomIngredientsToShoppingList(ingredient, () => history.push(routes.SHOPPING_LIST), newShoppingListItemsId, uid));
      setFieldValue("");
    }
  })
)(AddCustomIngredientBase);
