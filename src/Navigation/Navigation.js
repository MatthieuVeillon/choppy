import React, { useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import * as routes from '../constants/routes';
import { SignOutButton } from '../authentication/SignOut';
import { Box } from '../BasicComponents/Box';
import { userContext } from '../Context/UserContext';

export const Navigation = props => {
  const authUser = useContext(userContext).authUser;
  console.log(authUser); //?
  return (
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
        <Box grow={1} justifyContent={'flex-end'}>
          <SignOutButton />
        </Box>
      )}
    </StyledNav>
  );
};

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
