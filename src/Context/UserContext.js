import React from 'react';
import { useAuthenticateUser } from '../authentication/useAuthenticateUser';

const userContext = React.createContext();
const { Provider } = userContext;

const UserProvider = ({ children }) => {
  const { authUser } = useAuthenticateUser();
  return <Provider value={authUser}>{children}</Provider>;
};

export { UserProvider, userContext };
