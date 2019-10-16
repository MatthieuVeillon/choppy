import { Button, Input } from 'antd';
import React from 'react';
import styled from 'styled-components';
import '../IngredientInput.css';

const { TextArea } = Input;

export const CookingStepField = ({
  step,
  index,
  handleChangeInDynamicElement,
  handleRemoveItem
}) => (
  <CookingStepContainer>
    <TextArea
      placeholder={`Step ${index + 1}`}
      onChange={event =>
        handleChangeInDynamicElement(event, index, 'name', 'cookingSteps')
      }
      value={step.name}
      required
      autosize
      style={{ marginRight: `${index === 0 ? '' : '1%'}` }}
    />
    {index !== 0 && (
      <Button
        size="small"
        type="primary"
        onClick={() => handleRemoveItem(index, 'cookingSteps')}
        shape="circle"
        icon="minus"
      />
    )}
  </CookingStepContainer>
);

const CookingStepContainer = styled.div`
  display: flex;
  minwidth: '100%';
  justify-content: start;
  align-items: center;
  margin: 3px 0px 3px 0px;
`;
