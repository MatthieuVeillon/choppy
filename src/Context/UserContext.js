import React from 'react';
import { useAuthenticateUser } from '../authentication/useAuthenticateUser';

let userContext;
const { Provider, Consumer } = (userContext = React.createContext());

const UserProvider = ({ children }) => {
  const { authUser } = useAuthenticateUser();
  return <Provider value={authUser}>{children}</Provider>;
};

export { UserProvider, userContext };
