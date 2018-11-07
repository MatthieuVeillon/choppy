import React from "react";
import { connect } from "react-redux";
import { Box } from "../BasicComponents/Box";
import { PasswordChangeForm } from "../authentication/PasswordChangeForm";
import { PasswordForgetForm } from "../authentication/PasswordForget";
import { renderNothing, compose, branch } from "recompose";

const AccountPageBase = ({ authUser }) => (
  <Box vertical>
    <h1>Account: {authUser.email}</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </Box>
);

export const AccountPage = compose(
  connect(({ sessionState }) => ({ authUser: sessionState.authUser })),
  branch(({ authUser }) => !authUser, renderNothing)
)(AccountPageBase);
