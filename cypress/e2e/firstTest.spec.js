/// <reference types="cypress" />

describe("HomePage", () => {
  it("should navigate to right recipe Page", () => {
    cy.visit("/")
      .getByText("gratin dauphinois test")
      .click()
      .getByText("gratin dauphinois test");
  });
});
