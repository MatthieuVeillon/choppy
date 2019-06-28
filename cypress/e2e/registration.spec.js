describe("login", () => {
  beforeEach(() => indexedDB.deleteDatabase("firebaseLocalStorageDb"));

  it("should login in app", () => {
    cy.visit("/add-Recipe")
      .getByText(/sign in with email/i)
      .click()
      .get(".mdl-textfield__input")
      .type("mveillon@octopus-itsm.com")
      .get(".firebaseui-id-submit")
      .click()
      .get(":nth-child(3) > .mdl-textfield__input")
      .type("abc123")
      .get(".firebaseui-id-submit")
      .click()
      .url()
      .should("eq", `${Cypress.config().baseUrl}/`)
      .window()
      .get(".sc-bdVaJa > .sc-bxivhb");
  });
});
