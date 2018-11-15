import React, { Component } from "react";
import { ImageInput } from "../FormInput/ImageInput";
import { CheckboxSlider } from "../CheckboxSlider";
import { connect } from "react-redux";
import { storageRef } from "../firebase/index";
import { IngredientField } from "../FormInput/IngredientField";
import { CookingStepField } from "../FormInput/CookingStepField";
import { addRecipe } from "../Recipe/reducer/recipe-reducer";
import { Box, Button, FormField } from "../BasicComponents/Box";
import { Form } from "../BasicComponents/Form";
import { branch, renderComponent, compose } from "recompose";
import _ from "lodash";
import { SignInWithFirebase } from "../authentication/SignInWithFireBaseUI";

const initialState = {
  title: "",
  ingredients: [{ name: "", quantity: 0, measure: "" }],
  cookingSteps: [{ name: "" }],
  categories: {
    vegan: false,
    healthy: false
  },
  canBeFrozen: false,
  cookingTime: "",
  uploadImageUrl: "",
  defaultPortionNumber: "",
  pricePerPortion: ""
};

class AddRecipeForm extends Component {
  constructor(props) {
    super();
    this.state = initialState;
  }

  handleSubmit = event => {
    event.preventDefault();
    const recipe = this.state;
    this.props.addRecipe(recipe, () => this.props.history.push("/"));
    this.setState(initialState);
  };

  handleChange = event => {
    const target = event.target;
    this.setState(() => ({
      [target.id]: target.type === "checkbox" ? target.checked : target.value
    }));
  };

  handleFile = event => {
    const file = event.target.files[0];
    if (!file) return;

    storageRef
      .ref()
      .child(`${file.name}`)
      .put(file)
      .then(() =>
        storageRef
          .ref()
          .child(`${file.name}`)
          .getDownloadURL()
          .then(url => this.setState({ uploadImageUrl: url }))
      );
  };

  handleChangeInDynamicElement = (event, index, name, arrayToMap) => {
    const newItems = this.state[arrayToMap].map((item, secondIndex) => {
      if (index !== secondIndex) return item;
      return { ...item, [name]: event.target.value };
    });
    this.setState({ [arrayToMap]: newItems });
  };

  handleChangeInNestedState = (event, parentProperty, property) => {
    let obj = { ...this.state[parentProperty] };
    obj[property] = event.target.checked;
    this.setState({
      [parentProperty]: obj
    });
  };

  handleAddItem = object => {
    this.setState({
      [object]: this.state[object].concat([{}])
    });
  };

  handleRemoveItem = (index, object) => {
    this.setState({
      [object]: this.state[object].filter((item, secondIndex) => index !== secondIndex)
    });
  };

  render() {
    const {
      title,
      categories: { vegan, healthy },
      cookingTime,
      canBeFrozen,
      pricePerPortion,
      defaultPortionNumber
    } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormField type="text" value={title} onChange={this.handleChange} id="title" placeholder={"title"} required width="250px" />

        {this.state.ingredients.map((ingredient, index) => (
          <IngredientField
            key={index}
            ingredient={ingredient}
            index={index}
            handleChangeInDynamicElement={this.handleChangeInDynamicElement}
            handleRemoveItem={this.handleRemoveItem}
          />
        ))}

        <button type="button" onClick={() => this.handleAddItem("ingredients")} className="small">
          Add Ingredient
        </button>

        {this.state.cookingSteps.map((step, index) => (
          <CookingStepField
            key={index}
            step={step}
            index={index}
            handleChangeInDynamicElement={this.handleChangeInDynamicElement}
            handleRemoveItem={this.handleRemoveItem}
          />
        ))}

        <button type="button" onClick={() => this.handleAddItem("cookingSteps")} className="small">
          Add Step
        </button>

        <FormField
          top="8px"
          type="number"
          value={cookingTime}
          onChange={this.handleChange}
          id="cookingTime"
          placeholder={"cooking time in min"}
          required
        />

        <FormField
          top="8px"
          type="number"
          value={pricePerPortion}
          onChange={this.handleChange}
          id="pricePerPortion"
          placeholder={"price per portion"}
          required
        />

        <FormField
          top="8px"
          type="number"
          value={defaultPortionNumber}
          onChange={this.handleChange}
          id="defaultPortionNumber"
          placeholder="number of portion"
          required
        />

        <Box top="8px" width="300px" spaceBetween>
          <CheckboxSlider name="canBeFrozen" onChange={this.handleChange} value={canBeFrozen} />
          <CheckboxSlider name="Vegan" onChange={event => this.handleChangeInNestedState(event, "categories", "vegan")} value={vegan} />
          <CheckboxSlider
            name="Healthy"
            onChange={event => this.handleChangeInNestedState(event, "categories", "healthy")}
            value={healthy}
          />
        </Box>
        <ImageInput name="picture: " onChange={this.handleFile} required />
        <Button primary type="submit" top="10px">
          SUBMIT RECIPE
        </Button>
      </Form>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addRecipe: (recipe, navigateToHome) => dispatch(addRecipe(recipe, navigateToHome))
  };
};

export const AddRecipeFormPage = compose(
  connect(
    ({ sessionState }) => ({
      uid: _.get(sessionState, "authUser.uid")
    }),
    mapDispatchToProps
  ),
  branch(({ uid }) => !uid, renderComponent(SignInWithFirebase))
)(AddRecipeForm);
