import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { filterIngredientsToRemove } from './shoppingList-reducer';

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
});
