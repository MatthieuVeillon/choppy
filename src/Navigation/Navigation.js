import React from "react";
import styled from "styled-components";
import { compose } from "recompose";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as routes from "../constants/routes";
import { SignOutButton } from "../authentication/SignOut";
import { Box } from "../BasicComponents/Box";

const NavigationBase = ({ authUser }) => (
  <StyledNav>
    <StyledLink exact to={routes.HOME}>
      Home
    </StyledLink>
    <StyledLink exact to={routes.ADD_RECIPE}>
      AddRecipe
    </StyledLink>
    <StyledLink exact to={routes.SHOPPING_LIST}>
      ShoppingList
    </StyledLink>
    {!authUser && (
      <StyledLink exact to={routes.SIGN_IN}>
        SignIn
      </StyledLink>
    )}
    {authUser && (
      <StyledLink exact to={routes.ACCOUNT}>
        Account
      </StyledLink>
    )}
    {authUser && (
      <Box grow={1} justifyContent={"flex-end"}>
        <SignOutButton />
      </Box>
    )}
  </StyledNav>
);

export const Navigation = compose(
  connect(
    ({ sessionState }) => ({
      authUser: sessionState.authUser
    }),
    undefined,
    undefined,
    { pure: false }
  )
)(NavigationBase);

const StyledLink = styled(NavLink)`
  margin: 5px;
  color: black;
  color: black;

  &.active {
    color: red;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: flex-start;
`;
