import { addRecipe, removeRecipe } from "./utils";
import uuid from "uuid/v4";

describe("Home", () => {
  const user = cy;
  const recipeId = uuid();

  beforeEach(() => {
    addRecipe(recipeId);
  });

  afterEach(() => {
    removeRecipe(recipeId);
  });

  it("should display recipes", () => {
    user.visit("/").getByText("gratin dauphinois test");
  });

  it("should redirect the user to right page when he clicks on a specific recipe", () => {
    user
      .visit("/")
      .getByText("gratin dauphinois test")
      .click()
      .getByText("gratin dauphinois test");
  });

  it("should filter out the recipes based on their categories", () => {
    user
      .visit("/")
      .getByText("Vegan")
      .click()
      .getByTestId("recipeList") //list of recipes
      .should("have.length", 1)
      .getByText("gratin dauphinois test");
  });

  it("should allow the user to search a specific recipe", () => {
    user
      .visit("/")
      .get("#search")
      .type("pizza")
      .getByText("Pizza Maison");
  });
});
