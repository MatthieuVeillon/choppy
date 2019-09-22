import React, { useState, useEffect, useMemo } from 'react';
import { database } from '../firebase';
import { transformedData } from '../Recipe/RecipeList/utilsRecipe';
import { useFirebaseGETApi } from '../Recipe/useFirebaseApi';

const recipesContext = React.createContext();
const { Provider } = recipesContext;
const fetchRecipeEndpoint = () => database.ref(`/recipes`).once('value');

const RecipesProvider = ({ children }) => {
  const [recipesFromDB, isInError, isLoading] = useFirebaseGETApi(
    fetchRecipeEndpoint,
    [],
    transformedData
  );
  const [recipes, setRecipes] = useState(recipesFromDB);

  useEffect(() => {
    setRecipes(recipesFromDB);
  }, [recipesFromDB]);

  const recipeContextValue = useMemo(() => {
    return {
      recipes,
      setRecipes,
      isLoading,
      isInError
    };
  }, [recipes, isInError, isLoading]);
  return <Provider value={recipeContextValue}>{children}</Provider>;
};

export { RecipesProvider, recipesContext };
