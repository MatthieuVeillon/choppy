import React from "react";
import styled from "styled-components";
import "../IngredientInput.css";
import { Box, FormField, Select } from "../BasicComponents/Box";

export const IngredientField = ({ ingredient, index, handleChangeInDynamicElement, handleRemoveItem }) => (
  <Box top="10px" bottom="5px" width="250px">
    <FormField
      grow="1"
      placeholder={`Ingredient ${index + 1}`}
      type="text"
      onChange={event => handleChangeInDynamicElement(event, index, "name", "ingredients")}
      value={ingredient.name}
      required
    />
    <FormField
      grow="2"
      placeholder={`qty`}
      width="20px"
      type="number"
      onChange={event => handleChangeInDynamicElement(event, index, "quantity", "ingredients")}
      value={ingredient.quantity}
      min={1}
      required
    />
    <Select
      style={selectStyle}
      value={ingredient.measure}
      onChange={event => handleChangeInDynamicElement(event, index, "measure", "ingredients")}
      required
    >
      <option value="g" defaultValue>
        g
      </option>
      <option value="l">l</option>
      <option value="cup">cup</option>
      <option value="piece">piece</option>
    </Select>

    {index !== 0 && (
      <button type="button" onClick={() => handleRemoveItem(index, "ingredients")}>
        -
      </button>
    )}
  </Box>
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
