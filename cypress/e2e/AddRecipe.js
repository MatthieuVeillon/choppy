import { cyan } from "@material-ui/core/colors";

describe("AddRecipe", () => {
  const user = cy;

  it("should be able to add a recipe with all the fields", () => {
    user
      .visit("add-recipe")
      .getByPlaceholderText("title")
      .type("escalope de veau à la crème")
      .getByPlaceholderText("Ingredient 1")
      .type("escalope")
      .get(":nth-child(2) > .bQMtcm")
      .type("1000")
      .getByText("Add Ingredient")
      .click()
      .getByPlaceholderText("Ingredient 2")
      .type("champignons")
      .get(":nth-child(3) > .bQMtcm")
      .type("200ª")
      .getByPlaceholderText("Step 1")
      .type("couper les champignons")
      .getByText("Add Step")
      .click()
      .getByPlaceholderText("Step 2")
      .type("cuire les champignons")
      .getByPlaceholderText("cooking time in min")
      .type("4")
      .getByPlaceholderText("price per portion")
      .type("10")
      .getByPlaceholderText("number of portion")
      .type("3")
      .get("#Vegan")
      .click();

    const mimeType = "image/jpeg";
    const filename = "recipePicture.jpeg";

    cy.get(".sc-bZQynM > input").then(subject => {
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
    user.getByText("SUBMIT RECIPE").click();
  });
});
