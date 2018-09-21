import React from "react";
import "../IngredientInput.css";
import { Box, TextArea } from "../BasicComponents/Box";

export const CookingStepField = ({ step, index, handleChangeInDynamicElement, handleRemoveItem }) => (
  <Box margin="10px 0px 5px 0px" width="250px">
    <TextArea
      placeholder={`Step ${index + 1}`}
      onChange={event => handleChangeInDynamicElement(event, index, "name", "cookingSteps")}
      value={step.name}
      required
    />
    {index !== 0 && (
      <button type="button" onClick={() => handleRemoveItem(index, "cookingSteps")}>
        -
      </button>
    )}
  </Box>
);
