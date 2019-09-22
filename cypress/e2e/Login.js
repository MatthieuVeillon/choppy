import { auth } from "../../src/firebase/firebase";

describe("Login", () => {
  const user = cy;

  it("should login programmatically", () => {
    user.login();
  });

  it("should be able to login in the app via UI", () => {
    user
      .visit("/")
      .getByText("SignIn")
      .click()
      .get(":nth-child(2) > .firebaseui-idp-button") //can access it with getByText as its firebaseUI
      .click()
      .get(".mdl-textfield__input")
      .type("mveillon@octopus-itsm.com")
      .get(".firebaseui-id-submit")
      .click()
      .get(":nth-child(3) > .mdl-textfield__input")
      .type("test1234")
      .get(".firebaseui-id-submit")
      .click()
      .getByText("Sign Out");
  });
});
