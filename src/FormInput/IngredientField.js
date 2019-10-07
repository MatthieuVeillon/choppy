import { Button, Input, Select } from 'antd';
import React from 'react';
import styled from 'styled-components';
import '../IngredientInput.css';

const { Option } = Select;

export const IngredientField = ({
  ingredient,
  index,
  handleChangeInDynamicElement,
  handleRemoveItem
}) => (
  <IngredientContainer>
    <Input
      type="text"
      placeholder={`Ingredient ${index + 1}`}
      value={ingredient.name}
      onChange={event =>
        handleChangeInDynamicElement(event, index, 'name', 'ingredients')
      }
      style={{ width: '55%', marginRight: '1%' }}
      required
    />

    <Input
      type="number"
      placeholder={`qty`}
      value={ingredient.quantity}
      onChange={event =>
        handleChangeInDynamicElement(event, index, 'quantity', 'ingredients')
      }
      min={1}
      required
      style={{ width: '15%', marginRight: '1%' }}
    />

    <Select
      value={ingredient.measure}
      style={{ width: '20%', marginRight: '1%' }}
      onChange={event =>
        handleChangeInDynamicElement(event, index, 'measure', 'ingredients')
      }
    >
      <Option value="g">g</Option>
      <Option value="cl">cl</Option>
      <Option value="cup">cup</Option>
      <Option value="piece">piece</Option>
    </Select>

    {index !== 0 && (
      <Button
        size="small"
        type="primary"
        onClick={() => handleRemoveItem(index, 'ingredients')}
        shape="circle"
        icon="minus"
      />
    )}
  </IngredientContainer>
);
const selectStyle = {
  height: '39px'
};

const IngredientContainer = styled.div`
  display: flex;
  max-width: 400px;
  justify-content: start;
  align-items: center;
  margin: 5px 0px 5px 0px;
`;
