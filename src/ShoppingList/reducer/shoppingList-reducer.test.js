import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  applyRemoveShoppingListItem,
  applyToggleShoppingListItem,
  applySetShoppingList,
  doFetchShoppingList,
  doSetShoppingList,
  filterIngredientsToRemove,
  SHOPPING_LIST_ITEM_REMOVE_FROM_STATE
} from './shoppingList-reducer';
import { doSetAllRecipes } from '../../Recipe/reducer/recipe-reducer';
import { database } from '../../firebase';

Enzyme.configure({ adapter: new Adapter() });

describe('shoppinglistItems', () => {
  let shoppingList;
  let recipeId;

  beforeEach(() => {
    shoppingList = {
      shoppingListItems: {
        '1234': { ingredientId: 987, name: 'patate', recipeId: 1234 },
        '2345': { ingredientId: 987, name: 'patate', recipeId: 5432 }
      },
      shoppingListRecipes: {
        '1234': { portion: 3 }
      }
    };

    recipeId = 1234;
  });

  it('should filter out the shoppinglistItems with the provided recipeId', () => {
    const result = filterIngredientsToRemove(
      recipeId,
      shoppingList.shoppingListItems
    );
    expect(result).toEqual([
      { ingredientId: 987, name: 'patate', recipeId: 1234 }
    ]);
  });

  describe('doSetAllRecipes', function() {
    it('should set all the Recipes', function() {
      const data = { recipe1: { title: 'pain' }, recipe2: { title: 'tomate' } };
      const action = doSetAllRecipes(data);
      const expectedAction = {
        type: 'RECIPES_ALL_SET',
        payload: { data: data }
      };

      expect(action).toEqual(expectedAction);
    });
  });

  describe('doFetchShoppingList', () => {
    it('should create an action to fetch the shopping list', function() {
      jest.spyOn(database, 'ref');
      database.ref.mockImplementation(() => ({
        once: jest.fn()
      }));
      const uid = 1234;
      const action = doFetchShoppingList(uid);
      const expectedAction = {
        type: 'FIREBASE_API',
        payload: {
          firebaseType: 'GET',
          firebaseMethod: () => database.ref.once('value'),
          onSuccess: doSetShoppingList
        }
      };
      //hack because those are different instance
      expect(JSON.stringify(action)).toEqual(JSON.stringify(expectedAction));

      database.ref.mockRestore();
    });
  });

  describe('doSetShoppingList', function() {
    it('should set ShoppingList', function() {
      const data = { recipe1: { title: 'pain' }, recipe2: { title: 'tomate' } };
      const action = doSetShoppingList(data);
      const expectedAction = {
        type: 'SHOPPING_LIST_SET',
        payload: { shoppingList: { ...data } }
      };

      expect(action).toEqual(expectedAction);
    });
  });

  describe('applySetShoppingList', () => {
    const shoppingListRecipesSample = {
      recipe1: { title: 'tarte', ingredient: 'pate' },
      recipe2: { title: 'tomates', ingredient: 'tomates cerises' }
    };

    [
      ({
        shoppingListItems: undefined,
        shoppingListItemsId: undefined,
        shoppingListRecipes: undefined
      },
      {
        shoppingListItems: 'shoppingListItems',
        shoppingListItemsId: undefined,
        shoppingListRecipes: null
      },
      {
        shoppingListItems: 'shoppingItems',
        shoppingListItemsId: 'shoppingItemsId',
        shoppingListRecipes: undefined
      },
      {
        shoppingListItems: null,
        shoppingListItemsId: null,
        shoppingListRecipes: shoppingListRecipesSample
      })
    ].forEach(testCase => {
      it('should apply the appropriate value  ', function() {
        const initialState = {};
        const action = {
          payload: {
            shoppingList: {
              shoppingListItems: testCase.shoppingListItems,
              shoppingListItemsId: testCase.shoppingListItemsId,
              shoppingListRecipes: testCase.shoppingListRecipes
            }
          }
        };

        const expectedFormat = {
          shoppingListItems: testCase.shoppingListItems
            ? testCase.shoppingListItems
            : {},
          shoppingListItemsId: testCase.shoppingListItemsId
            ? testCase.shoppingListItemsId
            : [],
          shoppingListRecipes: testCase.shoppingListRecipes
            ? [
                { title: 'tarte', ingredient: 'pate' },
                { title: 'tomates', ingredient: 'tomates cerises' }
              ]
            : []
        };

        expect(applySetShoppingList(action, initialState)).toEqual(
          expectedFormat
        );
      });
    });
  });

  describe('applyToggleShoppingListItem', function() {
    it('should mark an item purchased if this item is not yet purchased', function() {
      const action = {
        type: 'SHOPPING_LIST_ITEM_TOGGLE',
        payload: {
          purchased: false,
          ingredientID: '4322'
        }
      };

      const initialState = {
        shoppingListItems: {
          '4322': { ingredientID: '4322', purchased: false }
        }
      };

      const expectedState = {
        shoppingListItems: { '4322': { ingredientID: '4322', purchased: true } }
      };

      expect(applyToggleShoppingListItem(action, initialState)).toEqual(
        expectedState
      );
    });
  });

  describe('applyRemoveShoppingListItem', function() {
    it('should remove an item from the state', function() {
      const action = {
        type: 'SHOPPING_LIST_ITEM_REMOVE_FROM_STATE',
        ingredientID: '123'
      };

      const initialState = {
        shoppingListItems: {
          '123': { ingredientID: '123' },
          '234': { ingredientID: '234' }
        },
        shoppingListItemsId: ['123', '234'],
        shoppingListRecipes: [{ recipeId: '321' }]
      };

      const expectedState = {
        shoppingListItems: { '234': { ingredientID: '234' } },
        shoppingListItemsId: ['234'],
        shoppingListRecipes: [{ recipeId: '321' }]
      };

      expect(applyRemoveShoppingListItem(initialState, action)).toEqual(
        expectedState
      );
    });
  });
});
