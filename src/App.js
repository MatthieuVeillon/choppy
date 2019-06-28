import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import { AddRecipeForm } from './AddRecipeForm/AddRecipeForm';
import { PasswordForgetForm } from './authentication/PasswordForget';
import { SignInWithFirebase } from './authentication/SignInWithFireBaseUI';
import * as routes from './constants/routes.js';
// import './App.css';
//import { useWhyDidYouUpdate } from "./utils/useWhyDidYouUpdate";
import { recipesContext, RecipesProvider } from './Context/RecipesContext';
import { userContext, UserProvider } from './Context/UserContext';
import { Navigation } from './Navigation/Navigation';
import { RecipeDetailCard } from './Recipe/RecipeDetail/RecipeDetailCard';
import { RecipePage } from './Recipe/RecipePage';
import { ShoppingList } from './ShoppingList/ShoppingList';

export const App = props => {
  // useWhyDidYouUpdate("App", props);

  return (
    <UserProvider>
      <RecipesProvider>
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
      </RecipesProvider>
    </UserProvider>
  );
};

const AddRecipePage = () => {
  const authUser = useContext(userContext);
  return authUser ? <AddRecipeForm /> : <SignInWithFirebase />;
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
  const { recipes } = useContext(recipesContext);
  return recipes.length > 0 && <RecipeDetailCard {...props} />;
};
