describe("AddRecipe", () => {
  const user = cy;

  beforeEach(() => {
    user.login();
  });

  it("should be able to add a recipe with all the fields", () => {
    user
      .visit("add-recipe")
      .getByPlaceholderText("title")
      .type("escalope de veau à la crème");

    cy.get("[data-cy=Ingredient0]").as("Ingredient1");

    cy.get("@Ingredient1")
      .getByPlaceholderText("Ingredient1")
      .type("escalope")
      .getByPlaceholderText("qty")
      .type("1000");

    cy.get("[data-cy=addIngredient]").click();

    cy.get("[data-cy=Ingredient1]").as("Ingredient2");

    cy.get("@Ingredient2")
      .getByPlaceholderText("Ingredient2")
      .type("champignons")
      .get('[data-cy=Ingredient1] > [type="number"]')
      .type("200");

    cy.getByPlaceholderText("Step 1").type("couper les champignons");

    cy.get("[data-cy=addStep]").click();

    cy.getByPlaceholderText("Step 2")
      .type("cuire les champignons")
      .get("[data-cy=cookingTime]")
      .type("4")
      .get("[data-cy=pricePerPortion]")
      .type("10")
      .get("[data-cy=portionNumber]")
      .type("3")
      .get("[data-cy=vegan]")
      .click();

    const mimeType = "image/jpeg";
    const filename = "recipePicture.jpeg";

    cy.get("[data-cy=pictureUpload]").then(subject => {
      return cy
        .fixture(filename, "base64")
        .then(Cypress.Blob.base64StringToBlob)
        .then(blob => {
          const el = subject[0];
          const testFile = new File([blob], filename, { type: mimeType });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          el.dispatchEvent(new Event("change"));
          return subject;
        })
        .then(_ => cy.wait(3000));
    });
    cy.get("[data-cy=submit]").click();
  });
});
