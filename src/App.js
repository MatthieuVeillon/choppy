import React, { createContext, useContext } from 'react';
import { Route } from 'react-router-dom';
import { ShoppingList } from './ShoppingList/ShoppingList';
import { RecipeDetailCard } from './Recipe/RecipeDetail/RecipeDetailCard';
import { Navigation } from './Navigation/Navigation';
import * as routes from './constants/routes.js';
import { PasswordForgetForm } from './authentication/PasswordForget';
import { AddRecipeFormPage } from './AddRecipeForm/AddRecipeForm';
import { SignInWithFirebase } from './authentication/SignInWithFireBaseUI';
import { RecipePage } from './Recipe/RecipePage';
import { useWhyDidYouUpdate } from './utils/useWhyDidYouUpdate';
// import './App.css';
import { recipesContext, RecipesProvider } from './Context/RecipesContext';
import { userContext, UserProvider } from './Context/UserContext';

export const App = () => {
  //useWhyDidYouUpdate("App", props);

  return (
    <RecipesProvider>
      <UserProvider>
        <div className="App">
          <Navigation />
          <Route path={routes.ADD_RECIPE} component={AddRecipePage} />
          <Route exact path={routes.HOME} component={RecipePage} />
          <Route path={routes.SHOPPING_LIST} component={ShoppingListPage} />
          <Route
            path="/recipe/:recipeId"
            render={props => <RecipeDetailPage {...props} />}
          />
          <Route path={routes.SIGN_IN} component={SignInWithFirebase} />
          <Route path={routes.PASSWORD_FORGET} component={PasswordForgetForm} />
        </div>
      </UserProvider>
    </RecipesProvider>
  );
};

const AddRecipePage = () => {
  const authUser = useContext(userContext);
  return authUser ? <AddRecipeFormPage /> : <SignInWithFirebase />;
};

const ShoppingListPage = () => {
  const authUser = useContext(userContext);
  return authUser ? (
    <ShoppingList authUser={authUser} />
  ) : (
    <SignInWithFirebase />
  );
};

const RecipeDetailPage = props => {
  const recipes = useContext(recipesContext);
  return recipes.length > 0 && <RecipeDetailCard {...props} />;
};
