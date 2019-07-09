import { auth } from "../../src/firebase/firebase";
import { cyan } from "@material-ui/core/colors";

describe("Login.js", () => {
  const user = cy;
  //   beforeEach(() => {
  //     //indexedDB.deleteDatabase("firebaseLocalStorageDb");
  //     auth.signInWithEmailAndPassword("mveillon@octopus-itsm.com", "test1234");
  //   });

  it("should be able to login in the app", () => {
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

  //   it("should login without UI", () => {
  //     //auth.signInWithEmailAndPassword("mveillon@octopus-itsm.com", "test1234");
  //     user.visit("/").getByText("Sign Out");
  //   });
});
