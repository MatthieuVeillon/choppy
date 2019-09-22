export const transformedData = rawData =>
  Object.keys(rawData).map(recipeID => rawData[recipeID]);

const insensitiveSearch = (title, searchTerm) =>
  title.toLowerCase().includes(searchTerm.toLowerCase());

export const searchAndFilter = (recipes, filter, searchTerm) => {
  if (recipes === null || recipes.length === 0) return [];
  return recipes
    .filter(recipe => {
      if (filter === 'HEALTHY') {
        return recipe.categories.healthy;
      }
      if (filter === 'VEGAN') {
        return recipe.categories.vegan;
      }
      return true;
    })
    .filter(recipe => insensitiveSearch(recipe.title, searchTerm));
};
