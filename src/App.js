import React from "react";
import { Route } from "react-router-dom";
import Header from "./Header/header";
import { ShoppingList } from "./ShoppingList/ShoppingList";
import { VisibleRecipeList } from "./Recipe/RecipeList/RecipeList";
import { RecipeDetailCard } from "./Recipe/RecipeDetail/RecipeDetailCard";
import { Navigation } from "./Navigation/Navigation";
import * as routes from "./constants/routes.js";
import { SignInPage } from "./authentication/SignIn";
import { SignUpPage } from "./authentication/SignUp";
import { PasswordForgetForm } from "./authentication/PasswordForget";
import { withAuthentication } from "./authentication/withAuthentication";
import { AccountPage } from "./user/account";
import { lifecycle, compose } from "recompose";
import { uiConfig, ui } from "./firebase/auth";
import { AddRecipeFormPage } from "./AddRecipeForm/AddRecipeForm";

const App = () => {
  return (
    <div className="App">
      <Navigation />
      <Route path={routes.ADD_RECIPE} component={AddRecipeFormPage} />
      <Route
        exact
        path={routes.HOME}
        render={() => (
          <div>
            <Header />
            <VisibleRecipeList />
          </div>
        )}
      />
      <Route path={routes.SHOPPING_LIST} component={ShoppingList} />
      <Route path="/recipe/:recipeId" component={RecipeDetailCard} />
      <Route path={routes.SIGN_IN} component={SignInWithFirebase} />
      <Route path={routes.PASSWORD_FORGET} component={PasswordForgetForm} />
      <Route path={routes.SIGN_UP} component={SignUpPage} />
      <Route path={routes.ACCOUNT} component={AccountPage} />
    </div>
  );
};

export const SignInWithFirebase = compose(
  lifecycle({
    componentDidMount() {
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  })
)(() => <div id="firebaseui-auth-container" />);

export default withAuthentication(App);
