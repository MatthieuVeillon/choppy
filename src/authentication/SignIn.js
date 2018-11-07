import { Box, Button, FormField } from "../BasicComponents/Box";
import React, { Component } from "react";
import { SignUpLink } from "./SignUp";
import { auth } from "../firebase/index";
import * as routes from "../constants/routes";
import { Form } from "../BasicComponents/Form";
import { compose } from "recompose";
import { Link, withRouter } from "react-router-dom";
import { PasswordForgetLink } from "./PasswordForget";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class SignInForm extends Component {
  constructor() {
    super();
    this.state = INITIAL_STATE;
  }

  onSubmit = event => {
    const { email, password } = this.state;
    const { history } = this.props;

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });

    event.preventDefault();
  };

  onHandleChange = event => this.setState(byPropKey(event.target.id, event.target.value));

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";

    return (
      <Form onSubmit={this.onSubmit}>
        <FormField type="text" value={email} onChange={this.onHandleChange} id="email" placeholder={"email"} width="250px" bottom="10px" />
        <FormField
          type="password"
          value={password}
          onChange={this.onHandleChange}
          id="password"
          placeholder={"password"}
          width="250px"
          bottom="10px"
        />
        <Button primary disabled={isInvalid} type="submit">
          Sign In
        </Button>
        {error && <p> {error.message}</p>}
      </Form>
    );
  }
}
export const SignInLink = () => (
  <Box>
    <Link to={routes.SIGN_IN}> Sign In </Link>
  </Box>
);

const SignInPageBase = ({ history }) => (
  <Box vertical>
    <h1>Sign In</h1>
    <SignInForm history={history} />
    <SignUpLink />
    <PasswordForgetLink />
  </Box>
);

export const SignInPage = compose(withRouter)(SignInPageBase);
