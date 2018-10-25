import React from "react";
import { connect } from "react-redux";
import { Box } from "../BasicComponents/Box";
import { PasswordChangeForm } from "../authentication/PasswordChangeForm";
import { PasswordForgetForm } from "../authentication/PasswordForget";

const AccountPageBase = ({ authUser }) => (
  <Box vertical>
    <h1>Account: {authUser.email}</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </Box>
);

export const AccountPage = connect(({ sessionState }) => ({ authUser: sessionState.authUser }))(AccountPageBase);
