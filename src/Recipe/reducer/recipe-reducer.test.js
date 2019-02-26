import {
  addIdToRecipeAndIngredients,
  applySetAllRecipes,
  applySetNewRecipe,
  doSetAllRecipes
} from './recipe-reducer';

jest.mock('uuid/v4', () => jest.fn(() => 12345));

describe('recipe-Reducer', function() {
  describe('addIdToRecipeAndIngredients', function() {
    it('it shoud add id to recipe', function() {
      const recipe = {
        title: 'tarte',
        ingredients: [{ tomate: {} }, { tarte: {} }],
        price: 123
      };
      const key = 6574;

      addIdToRecipeAndIngredients(recipe, key);
      expect(recipe.recipeId).toEqual(key);
      expect(recipe.ingredients[0].ingredientId).toEqual(12345);
      expect(recipe.ingredients[0].recipeId).toEqual(key);
      expect(recipe.ingredients[1].ingredientId).toEqual(12345);
      expect(recipe.ingredients[1].recipeId).toEqual(key);
    });
  });

  describe('doSetRecipe', function() {
    it('should set Recipes', function() {
      const data = { recipe1: { title: 'pain' }, recipe2: { title: 'tomate' } };
      const action = doSetAllRecipes(data);
      const expectedAction = {
        type: 'RECIPES_ALL_SET',
        payload: { data: data }
      };

      expect(action).toEqual(expectedAction);
    });
  });

  describe('applySetAllRecipes', function() {
    it('should format recipes into an array', function() {
      const initialState = {};
      const action = {
        payload: {
          data: {
            recipe1: { title: 'tomate' },
            recipe2: { title: 'pain' }
          }
        }
      };

      const expectedFormatedData = {
        recipes: [{ title: 'tomate' }, { title: 'pain' }]
      };

      expect(applySetAllRecipes(initialState, action)).toEqual(
        expectedFormatedData
      );
    });
  });

  describe('applySetNewRecipe', function() {
    it('should add recipe to current recipes array ', function() {
      const initialState = {
        recipes: [{ title: 'tarte' }, { title: 'tomate' }]
      };
      const action = {
        payload: {
          data: { title: 'fromage' }
        }
      };

      const expectedFormatedData = {
        recipes: [{ title: 'tarte' }, { title: 'tomate' }, { title: 'fromage' }]
      };

      expect(applySetNewRecipe(initialState, action)).toEqual(
        expectedFormatedData
      );
    });
  });
});
