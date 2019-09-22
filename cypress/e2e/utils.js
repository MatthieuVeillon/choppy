import uuid from "uuid/v4";
import { database } from "../../src/firebase";

export const addRecipeInShoppingList = async recipeId => {
  const shoppingList = {};
  const ingredient1Id = uuid();
  const ingredient2Id = uuid();
  // ingredients
  shoppingList["/shoppingListItems/"] = {
    [ingredient1Id]: {
      ingredientId: ingredient1Id,
      name: "pate",
      purchased: false,
      recipeId: recipeId
    },
    [ingredient2Id]: {
      ingredientId: ingredient2Id,
      name: "tomate",
      purchased: false,
      recipeId: recipeId
    }
  };

  shoppingList["/shoppingListItemsId/"] = [ingredient1Id, ingredient2Id];

  shoppingList["/shoppingListRecipes/"] = {
    [recipeId]: {
      portion: 2,
      recipeId: recipeId,
      title: "tarte à la tomate",
      uploadImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/choppy-c9325.appspot.com/o/rocking%20chair%20tatoo.jpg?alt=media&token=6f37c282-b86c-49eb-945d-7480e6cb3012"
    }
  };

  const endpoint = database.ref(`shoppingList/${Cypress.env("uid")}`);
  await endpoint.update(shoppingList);
};

export const addRecipe = async recipeId => {
  const ingredient1Id = uuid();
  const ingredient2Id = uuid();
  const ingredients = [
    { ingredientId: ingredient1Id, measure: "g", name: "pdt yukon", quantity: "2000", recipeId: recipeId },
    { ingredientId: ingredient2Id, measure: "kg", name: "veau", quantity: "1", recipeId: recipeId }
  ];

  const recipe = {
    canBeFrozen: false,
    categories: { vegan: false, healthy: false },
    cookingSteps: [{ name: "test" }],
    cookingTime: "23",
    defaultPortionNumber: "3",
    pricePerPortion: "12",
    recipeId: recipeId,
    title: "veau patate",
    uploadImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/choppy-c9325.appspot.com/o/rocking%20chair%20tatoo.jpg?alt=media&token=6f37c282-b86c-49eb-945d-7480e6cb3012",
    ingredients
  };

  const endpoint = database.ref(`recipes/${recipeId}`);
  await endpoint.update(recipe);
};

export const removeRecipe = async recipeId => {
  const endpoint = database.ref(`recipes/${recipeId}`);
  await endpoint.remove();
};
