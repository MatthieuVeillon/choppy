import { ui, uiConfig } from "../firebase/auth";
import { compose, lifecycle } from "recompose";
import React from "react";

export const SignInWithFirebase = compose(
  lifecycle({
    componentDidMount() {
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  })
)(() => <div id="firebaseui-auth-container" />);
