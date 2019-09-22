import React from 'react';
import { Button } from '../BasicComponents/Box';
import { doSignOut } from '../firebase/auth';

export const SignOutButton = () => (
  <Button secondary type="button" onClick={doSignOut}>
    Sign Out
  </Button>
);
