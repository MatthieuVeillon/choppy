import React, { Component } from "react";
import { Link } from "react-router-dom";

import { auth } from "../firebase";
import { Box, FormField } from "../BasicComponents/Box";
import { Form } from "../BasicComponents/Form";
import * as routes from "../constants/routes";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = { email: "", error: null };

export class PasswordForgetForm extends Component {
  constructor(props) {
    super();
    this.state = INITIAL_STATE;
  }

  onSubmit = event => {
    event.preventDefault();
    const { email } = this.state;

    auth
      .doPasswordReset(email)
      .then(() => this.setState({ ...INITIAL_STATE }))
      .catch(error => {
        this.setState(byPropKey("error", error));
      });
  };

  onHandleChange = event => {
    this.setState(byPropKey(event.target.id, event.target.value));
  };

  render() {
    const { email, error } = this.state;
    const isInvalid = email === "";

    return (
      <Form>
        <FormField type="text" value={email} onChange={this.onHandleChange} id="email" placeholder={"email"} width="250px" bottom="10px" />
      </Form>
    );
  }
}

export const PasswordForgetLink = () => (
  <p>
    <Link to={routes.PASSWORD_FORGET}>Forgot password ?</Link>
  </p>
);

export const PasswordForgetPage = () => (
  <Box>
    <h1> PasswordForget</h1>
    <PasswordForgetForm />
  </Box>
);
