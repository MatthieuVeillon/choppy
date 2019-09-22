import { auth, database } from "../../src/firebase";

Cypress.Commands.add("login", () => {
  auth.signInWithEmailAndPassword(Cypress.env("email"), Cypress.env("password"));
  cy.visit("/").getByText("Sign Out");
});

Cypress.Commands.add("resetShoppingList", async () => {
  const removeShoppingList = database.ref(`shoppingList/${Cypress.env("uid")}`);
  await removeShoppingList.remove();
});
