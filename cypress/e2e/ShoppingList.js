import uuid from "uuid/v4";
import { addRecipeInShoppingList } from "./utils";

describe("ShoppingList", () => {
  const user = cy;

  beforeEach(() => {
    user.login();
    user.resetShoppingList();
  });

  it("should show an empty shoppingList when user has not yet added an item", () => {
    user
      .visit("shopping-list")
      .getByTestId("shoppingList")
      .should("be.empty");
  });

  it("should cross an ingredient when the user click on it", () => {
    const recipeId = uuid();
    addRecipeInShoppingList(recipeId);

    user
      .visit("shopping-list")
      .get(":nth-child(1) > .ipQTQY")
      .get(".eoDEUo")
      .click()
      .should("have.css", "text-decoration", "line-through solid rgb(211, 211, 211)");
  });

  it("should be able to add a custom ingredient", () => {
    user
      .visit("shopping-list")
      .get("input")
      .wait(100)
      .get("input")
      .type("bière IPA Castor x 4")
      .get("input")
      .type("{enter}")
      .getByText("bière IPA Castor x 4");
  });

  it("should be able to remove ingredients from the shopping List", () => {
    const recipeId = uuid();
    addRecipeInShoppingList(recipeId);

    user
      .visit("shopping-list")
      .getByTestId("shoppingList")
      .wait(200)
      .getByTestId("shoppingList")
      .children()
      .should("have.length", 2)
      .getByTestId("removetomate")
      .click()
      .getByTestId("shoppingList")
      .should("have.length", 1);
  });

  it("should  remove the corresponding recipe when all the last ingredient of this shoppingList is removed", () => {
    const recipeId = uuid();
    addRecipeInShoppingList(recipeId);

    user
      .visit("shopping-list")
      .getByTestId("shoppingList")
      .wait(200)
      .getByTestId("removetomate")
      .click()
      .get("img")
      .getByTestId("removepate")
      .click()
      .get("img")
      .should("not.exist");
  });

  it("should remove a specific recipe and the corresponding ingredient", () => {
    const recipeId = uuid();
    addRecipeInShoppingList(recipeId);

    user
      .visit("shopping-list")
      .getByTestId(`remove${recipeId}`)
      .click()
      .getByTestId("shoppingList")
      .children()
      .should("have.length", 0);
  });

  it("should be able to move an item in the list", () => {
    const recipeId = uuid();
    addRecipeInShoppingList(recipeId);

    cy.visit("shopping-list")
      .get("[data-react-beautiful-dnd-drag-handle]")
      .eq(0)
      .as("first")
      .should("contain", "pate");

    cy.get("[data-react-beautiful-dnd-drag-handle]")
      .eq(1)
      .should("contain", "tomate");
    // reorder operation
    cy.get("@first")
      .focus()
      .trigger("keydown", { keyCode: 32 })
      .trigger("keydown", { keyCode: 40, force: true })
      // finishing before the movement time is fine - but this looks nice
      .wait(500)
      .trigger("keydown", { keyCode: 32, force: true });

    // order now 2, 1
    // note: not using get aliases as they where returning incorrect results
    cy.get("[data-react-beautiful-dnd-drag-handle]")
      .eq(0)
      .should("contain", "tomate");

    cy.get("[data-react-beautiful-dnd-drag-handle]")
      .eq(1)
      .should("contain", "pate");
  });
});
