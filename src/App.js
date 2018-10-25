import React, { Component } from "react";
import "./App.css";
import { Route } from "react-router-dom";
import AddRecipeForm from "./AddRecipeForm/AddRecipeForm";
import Header from "./Header/header";
import { ShoppingList } from "./ShoppingList/ShoppingList";
import { VisibleRecipeList } from "./Recipe/RecipeList/RecipeList";
import { RecipeDetailCard } from "./Recipe/RecipeDetail/RecipeDetailCard";
import { Navigation } from "./Navigation/Navigation";
import * as routes from "./constants/routes.js";
import { SignInPage } from "./authentication/SignIn";
import { SignUpPage } from "./authentication/SignUp";
import { PasswordForgetPage } from "./authentication/PasswordForget";
import { withAuthentication } from "./authentication/withAuthentication";
import { AccountPage } from "./user/account";

const App = () => {
  return (
    <div className="App">
      <Navigation />
      <Route path={routes.ADD_RECIPE} component={AddRecipeForm} />
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
      <Route path={routes.SIGN_IN} component={SignInPage} />
      <Route path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={routes.SIGN_UP} component={SignUpPage} />
      <Route path={routes.ACCOUNT} component={AccountPage} />
    </div>
  );
};

export default withAuthentication(App);
