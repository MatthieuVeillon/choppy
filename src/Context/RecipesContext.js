import React, { useState } from 'react';
import { database } from '../firebase';
import { transformedData } from '../Recipe/RecipeList/utilsRecipe';
import { useFirebaseApi } from '../Recipe/useFirebaseApi';

const recipesContext = React.createContext();
const { Provider } = recipesContext;
const ref = database.ref(`/recipes`);

const RecipesProvider = ({ children }) => {
  const [recipesFromDB] = useFirebaseApi(ref, [], transformedData);
  const [recipes, setRecipes] = useState(recipesFromDB);
  return <Provider value={recipesFromDB}>{children}</Provider>;
};

export { RecipesProvider, recipesContext };
