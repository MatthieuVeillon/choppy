import React from "react";
import styled from "styled-components";
import "./IngredientInput.css";

export const StepInput = ({ step, index, handleChangeInDynamicElement, handleRemoveItem }) => (
  <FlexContainer>
    <StyledTextArea
      placeholder={`Step ${index + 1}`}
      onChange={event => handleChangeInDynamicElement(event, index, "name", "cookingSteps")}
      value={step.name}
    />

    {index !== 0 && (
      <button type="button" onClick={() => handleRemoveItem(index, "cookingSteps")}>
        -
      </button>
    )}
  </FlexContainer>
);

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTextArea = styled.textarea`
  padding: 12px 20px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;
