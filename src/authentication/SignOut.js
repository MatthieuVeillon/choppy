import React from "react";
import { auth } from "../firebase/index";
import { Button } from "../BasicComponents/Box";

export const SignOutButton = () => (
  <Button secondary type="button" onClick={auth.doSignOut}>
    Sign Out
  </Button>
);
