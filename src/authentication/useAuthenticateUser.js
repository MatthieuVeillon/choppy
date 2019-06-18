import { auth } from '../firebase';
import { useEffect, useState } from 'react';

export const useAuthenticateUser = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(
    () => {
      auth.onAuthStateChanged(authUser => {
        authUser ? setAuthUser(authUser) : setAuthUser(null);
      });
    },
    [authUser]
  );

  return { authUser };
};
