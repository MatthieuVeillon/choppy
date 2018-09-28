import React from "react";
import "../IngredientInput.css";
import { Box, TextArea } from "../BasicComponents/Box";

export const CookingStepField = ({ step, index, handleChangeInDynamicElement, handleRemoveItem }) => (
  <Box top="10px" bottom="5px" width="250px">
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
