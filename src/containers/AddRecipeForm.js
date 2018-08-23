import React, { Component } from "react";
import { TextInput } from "../components/TextInput";
import { ImageInput } from "../components/ImageInput";
import { CheckboxSlider } from "../components/CheckboxSlider";
import styled from "styled-components";
import { connect } from "react-redux";
import { addRecipe } from "../actions";
import { storageRef } from "../firebase/index";
import { IngredientInput } from "../components/IngredientInput";
import { StepInput } from "../components/StepInput";
import { NumberInput } from "../components/NumberInput";

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
    this.setState({
      [target.id]: target.type === "checkbox" ? target.checked : target.value
    });
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
      <Formflex onSubmit={this.handleSubmit}>
        <TextInput name="title" onChange={this.handleChange} value={title} />

        {this.state.ingredients.map((ingredient, index) => (
          <IngredientInput
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
          <StepInput
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

        <NumberInput
          onChange={this.handleChange}
          name="cookingTime"
          placeholder="cooking time in min"
          value={cookingTime}
        />
        <NumberInput
          onChange={this.handleChange}
          name="pricePerPortion"
          placeholder="price per portion"
          value={pricePerPortion}
        />
        <NumberInput
          onChange={this.handleChange}
          name="defaultPortionNumber"
          placeholder="number of portion"
          value={defaultPortionNumber}
        />

        <CheckboxSlider name="canBeFrozen" onChange={this.handleChange} value={canBeFrozen} />

        <CheckBoxWrapper>
          <CheckboxSlider
            name="Vegan"
            onChange={event => this.handleChangeInNestedState(event, "categories", "vegan")}
            value={vegan}
          />
          <CheckboxSlider
            name="Healthy"
            onChange={event => this.handleChangeInNestedState(event, "categories", "healthy")}
            value={healthy}
          />
        </CheckBoxWrapper>

        <ImageInput name="picture: " onChange={this.handleFile} required />
        <SubmitButton type="submit">SAVE</SubmitButton>
      </Formflex>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addRecipe: (recipe, navigateToHome) => dispatch(addRecipe(recipe, navigateToHome))
  };
};
export default connect(
  null,
  mapDispatchToProps
)(AddRecipeForm);

const Formflex = styled.form`
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 5px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
