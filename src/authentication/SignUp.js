import React, { Component } from "react";
import { Box, Button, FormField } from "../BasicComponents/Box";
import { Form } from "../BasicComponents/Form";
import { Link, withRouter } from "react-router-dom";
import { auth } from "../firebase/index";
import { compose } from "recompose";
import * as routes from "../constants/routes";

export const SignUpLink = () => (
  <Box>
    <Link to={routes.SIGN_UP}> Sign Up </Link>
  </Box>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class SignUpForm extends Component {
  constructor(props) {
    super();
    this.state = INITIAL_STATE;
  }

  onSubmit = async event => {
    const { username, email, passwordOne } = this.state;
    const { history } = this.props;

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });

    event.preventDefault();
  };

  onHandleChange = event => this.setState(byPropKey(event.target.id, event.target.value));

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "" || email === "" || username === "";

    return (
      <Form onSubmit={this.onSubmit}>
        <FormField
          type="text"
          value={username}
          onChange={this.onHandleChange}
          id="username"
          placeholder={"fullname"}
          width="250px"
          bottom="10px"
        />
        <FormField type="text" value={email} onChange={this.onHandleChange} id="email" placeholder={"email"} width="250px" bottom="10px" />
        <FormField
          type="text"
          value={passwordOne}
          onChange={this.onHandleChange}
          id="passwordOne"
          placeholder={"password"}
          width="250px"
          bottom="10px"
        />
        <FormField
          type="text"
          value={passwordTwo}
          onChange={this.onHandleChange}
          id="passwordTwo"
          placeholder={"confirm password"}
          width="250px"
          bottom="10px"
        />
        <Button primary disabled={isInvalid} type="submit">
          Sign Up
        </Button>
        {error && <p> {error.message}</p>}
      </Form>
    );
  }
}

const SignUpPageBase = ({ history }) => (
  <Box vertical>
    <h1>Sign Up</h1>
    <SignUpForm history={history} />
  </Box>
);

export const SignUpPage = compose(withRouter)(SignUpPageBase);
