import React from "react";
import styled from "styled-components";
import "./IngredientInput.css";

export const IngredientInput = ({
  ingredient,
  index,
  handleChangeInDynamicElement,
  handleRemoveItem,
}) => (
  <FlexContainer>
    <StyledInputText
      placeholder={`Ingredient ${index + 1}`}
      type="text"
      onChange={event => handleChangeInDynamicElement(event, index, "name", "ingredients")}
      value={ingredient.name}
    />
    <StyledInputNumber
      placeholder={`qty`}
      type="number"
      onChange={event => handleChangeInDynamicElement(event, index, "quantity", "ingredients")}
      value={ingredient.quantity}
      min={1}
    />
    <select
      style={selectStyle}
      value={ingredient.measure}
      onChange={event => handleChangeInDynamicElement(event, index, "measure", "ingredients")}
    >
      <option value="g" defaultValue>
        g
      </option>
      <option value="l">l</option>
      <option value="cup">cup</option>
      <option value="piece">piece</option>
    </select>

    {index !== 0 && (
      <button type="button" onClick={() => handleRemoveItem(index, "ingredients")}>
        -
      </button>
    )}
  </FlexContainer>
);
const selectStyle = {
  height: "39px"
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInputText = styled.input`
  padding: 12px 20px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const StyledInputNumber = styled.input`
  width: 80px;
  padding: 12px 20px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;
