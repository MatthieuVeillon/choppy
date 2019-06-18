import { searchAndFilter } from './utilsRecipe';

describe('RecipeList', function() {
  describe('SearchAndFilter', function() {
    const recipes = [
      {
        title: 'tarte à la tomate',
        categories: { vegan: true, healthy: true }
      },
      { title: 'crevette thai', categories: { vegan: false, healthy: true } },
      {
        title: 'tarte à la viande',
        categories: { vegan: false, healthy: false }
      }
    ];

    it('should filter based on the filter provided', function() {
      const veganResult = searchAndFilter(recipes, 'VEGAN', '');
      expect(veganResult).toEqual([
        {
          title: 'tarte à la tomate',
          categories: { vegan: true, healthy: true }
        }
      ]);

      const healthyResult = searchAndFilter(recipes, 'HEALTHY', '');
      expect(healthyResult).toEqual([
        {
          title: 'tarte à la tomate',
          categories: { vegan: true, healthy: true }
        },
        { title: 'crevette thai', categories: { vegan: false, healthy: true } }
      ]);

      const allResult = searchAndFilter(recipes, 'ALL', '');
      expect(allResult).toEqual(recipes);
    });

    it('should filter based on the searchTerm provided', function() {
      const result = searchAndFilter(recipes, 'ALL', 'tarte');
      expect(result).toEqual([
        {
          title: 'tarte à la tomate',
          categories: { vegan: true, healthy: true }
        },
        {
          title: 'tarte à la viande',
          categories: { vegan: false, healthy: false }
        }
      ]);
    });
  });
});
