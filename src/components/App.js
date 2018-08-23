import React, { Component } from "react";
import "../App.css";
import { NavLink, Route } from "react-router-dom";
import AddRecipeForm from "../containers/AddRecipeForm";
import styled from "styled-components";
import { connect } from "react-redux";
import { getRecipes } from "../actions";
import Header from "./header";
import RecipeDetail from "./RecipeDetail";
import { ShoppingList } from "./ShoppingList";
import {VisibleRecipeList} from "./RecipeList";

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getRecipes());
  }

  componentDidUpdate() {
    const { dispatch } = this.props;
    dispatch(getRecipes());
  }

  render() {
    return (
      <div className="App">
        <StyledNav>
          <StyledLink exact to="/">
            Home
          </StyledLink>
          <StyledLink exact to="/AddRecipe">
            AddRecipe
          </StyledLink>
          <StyledLink exact to="/ShoppingList">
            ShoppingList
          </StyledLink>
        </StyledNav>
        <Route path="/AddRecipe" component={AddRecipeForm} />
        <Route
          exact
          path="/"
          render={() => (
            <div>
              <Header />
              <VisibleRecipeList />
            </div>
          )}
        />
        <Route path="/ShoppingList" component={ShoppingList} />

        <Route path="/recipe/:recipeId" component={RecipeDetail} />
      </div>
    );
  }
}

export default connect()(App);

const StyledLink = styled(NavLink).attrs({
  activeClassName: "active"
})`
  margin: 5px;
  color: black;

  &.active {
    color: red;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: flex-start;
`;
