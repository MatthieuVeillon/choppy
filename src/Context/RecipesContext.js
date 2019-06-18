import React from 'react';
import { useFirebaseApi } from '../Recipe/useFirebaseApi';
import { database } from '../firebase';
import { transformedData } from '../Recipe/RecipeList/utilsRecipe';

const recipesContext = React.createContext();
const { Provider, Consumer } = recipesContext;
const ref = database.ref(`/recipes`);

const RecipesProvider = ({ children }) => {
  const [recipes, doFetchRecipes] = useFirebaseApi(ref, [], transformedData);
  return <Provider value={recipes}>{children}</Provider>;
};

export { RecipesProvider, recipesContext };
