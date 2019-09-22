import { transformDataForShoppingList } from './ShoppingList';

describe('ShoppingList', () => {
  const shoppingList = {
    shoppingListItems: {
      123: {
        ingredientId: 123,
        titre: 'pate a tarte'
      },
      234: {
        ingredientId: 234,
        titre: 'tomate'
      }
    },
    shoppingListItemsId: [234, 123],
    shoppingListRecipes: {
      897: {
        portion: 2,
        recipeId: 897,
        title: 'tarte a la tomate'
      }
    }
  };

  it('should transform ShoppingList into the right format before saving to the state', () => {
    const result = transformDataForShoppingList(shoppingList);

    expect(result.shoppingListItems.length).toBe(2);
    expect(result.shoppingListRecipes.length).toBe(1);
  });
});
