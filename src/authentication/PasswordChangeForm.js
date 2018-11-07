import React, { Component } from "react";
import { auth } from "../firebase";
import { Box, Button, FormField } from "../BasicComponents/Box";
import { Form } from "../BasicComponents/Form";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = { passwordOne: "", passwordTwo: "", error: null };

export class PasswordChangeForm extends Component {
  constructor(props) {
    super();
    this.state = INITIAL_STATE;
  }

  onSubmit = event => {
    event.preventDefault();
    const { passwordOne } = this.state;

    auth
      .doPasswordUpdate(passwordOne)
      .then(() => this.setState({ ...INITIAL_STATE }))
      .catch(error => {
        this.setState(byPropKey("error", error));
      });
  };

  onHandleChange = event => {
    this.setState(byPropKey(event.target.id, event.target.value));
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <Box vertical>
        <h3>Reset my password</h3>
        <Form>
          <FormField
            type="text"
            value={passwordOne}
            onChange={this.onHandleChange}
            id="passwordOne"
            placeholder={"New Password"}
            width="250px"
            bottom="10px"
          />
          <FormField
            type="text"
            value={passwordTwo}
            onChange={this.onHandleChange}
            id="passwordTwo"
            placeholder={"Confirm New Password"}
            width="250px"
            bottom="10px"
          />
          <Button primary disabled={isInvalid} type="submit">
            Reset my password
          </Button>
          {error && <p> {error.message}</p>}
        </Form>
      </Box>
    );
  }
}
