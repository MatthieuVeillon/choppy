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
  <CookingStepFieldsList>
    <TextArea
      placeholder={`Step ${index + 1}`}
      onChange={event =>
        handleChangeInDynamicElement(event, index, 'name', 'cookingSteps')
      }
      value={step.name}
      required
      autosize
      style={{ width: '92%', marginRight: '1%' }}
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
  </CookingStepFieldsList>
);

const CookingStepFieldsList = styled.div`
  display: flex;
  max-width: 400px;
  justify-content: start;
  align-items: center;
  margin: 5px 0px 5px 0px;
`;
