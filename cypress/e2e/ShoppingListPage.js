import { cyan } from "@material-ui/core/colors";

describe("ShoppingListPage.js", () => {
  it("should login in the app", () => {
    cy.login();
    cy.visit("/");
  });
});
