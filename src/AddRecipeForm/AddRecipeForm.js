import { Button, Checkbox, Input } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useHistory } from 'react-router';
import { compose } from 'recompose';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { recipesContext } from '../Context/RecipesContext';
import { database } from '../firebase';
import { storageRef } from '../firebase/index';
import { CookingStepField } from '../FormInput/CookingStepField';
import { IngredientField } from '../FormInput/IngredientField';
import { useFirebasePOSTApi } from '../Recipe/useFirebaseApi';

const initialState = {
  title: '',
  ingredients: [{ name: '', quantity: 0, measure: '' }],
  cookingSteps: [{ name: '' }],
  categories: {
    vegan: false,
    healthy: false
  },
  canBeFrozen: false,
  cookingTime: '',
  uploadImageUrl: '',
  defaultPortionNumber: '',
  pricePerPortion: ''
};

const addIdToRecipeAndIngredients = (recipe, key) => {
  recipe.recipeId = key;
  recipe.ingredients.forEach(ingredient => {
    ingredient.ingredientId = uuid();
    ingredient.recipeId = key;
  });
  return recipe;
};

const AddRecipeFormBase = () => {
  const [newRecipe, setNewRecipe] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { setRecipes } = useContext(recipesContext);
  const history = useHistory();

  //setup to post recipe on firebase
  const key = database.ref('/recipes/').push().key;
  const endpoint = database.ref('/recipes/' + key);
  const recipeWithId = addIdToRecipeAndIngredients(newRecipe, key);
  const [postNewRecipe] = useFirebasePOSTApi(endpoint, recipeWithId);

  const handleSubmit = event => {
    event.preventDefault();
    postNewRecipe();
    setRecipes(prevState => prevState.concat(newRecipe));
    history.push('/');
    event.preventDefault();
  };

  const handleChange = event => {
    const target = event.target;
    setNewRecipe(prevState => ({
      ...prevState,
      [target.id]: target.type === 'checkbox' ? target.checked : target.value
    }));
  };

  const handleFile = event => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);
    storageRef
      .ref()
      .child(`${file.name}`)
      .put(file)
      .then(() =>
        storageRef
          .ref()
          .child(`${file.name}`)
          .getDownloadURL()
          .then(url => {
            setNewRecipe(prevState => {
              return { ...prevState, uploadImageUrl: url };
            });
            setIsLoading(false);
          })
      );
  };
  const handleChangeInDynamicElement = (event, index, name, arrayToMap) => {
    const newItems = newRecipe[arrayToMap].map((item, secondIndex) => {
      if (index !== secondIndex) return item;
      return { ...item, [name]: _.get(event, 'target.value') || event };
    });
    setNewRecipe(prevState => {
      return { ...prevState, [arrayToMap]: newItems };
    });
  };

  const handleChangeInNestedState = (event, parentProperty, property) => {
    let obj = { ...newRecipe[parentProperty] };
    obj[property] = event.target.checked;
    setNewRecipe(prevState => {
      return { ...prevState, [parentProperty]: obj };
    });
  };

  const handleAddItem = object => {
    setNewRecipe(prevState => {
      return { ...prevState, [object]: newRecipe[object].concat([{}]) };
    });
  };

  const handleRemoveItem = (index, object) => {
    setNewRecipe(prevState => {
      return {
        ...prevState,
        [object]: newRecipe[object].filter(
          (item, secondIndex) => index !== secondIndex
        )
      };
    });
  };

  const {
    title,
    categories: { vegan, healthy },
    cookingTime,
    canBeFrozen,
    pricePerPortion,
    defaultPortionNumber
  } = newRecipe;

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <label>
          Recipe title:
          <Input
            type="text"
            value={title}
            placeholder="title"
            id="title"
            onChange={handleChange}
          />
        </label>
        <ItemsList>
          Ingredients :
          {newRecipe.ingredients.map((ingredient, index) => (
            <IngredientField
              key={index}
              ingredient={ingredient}
              index={index}
              handleChangeInDynamicElement={handleChangeInDynamicElement}
              handleRemoveItem={handleRemoveItem}
            />
          ))}
          <Button
            style={{ width: '30%' }}
            size="small"
            onClick={() => handleAddItem('ingredients')}
          >
            Add Ingredient
          </Button>
        </ItemsList>
        <ItemsList>
          Cooking Steps :
          {newRecipe.cookingSteps.map((step, index) => (
            <CookingStepField
              key={index}
              step={step}
              index={index}
              handleChangeInDynamicElement={handleChangeInDynamicElement}
              handleRemoveItem={handleRemoveItem}
            />
          ))}
          <Button
            style={{ width: '30%' }}
            size="small"
            onClick={() => handleAddItem('cookingSteps')}
          >
            Add Step
          </Button>
        </ItemsList>
        <div style={{ marginBottom: '5px' }}>
          <label>
            Cooking time :
            <Input
              type="number"
              placeholder="in min"
              id={'cookingTime'}
              value={cookingTime}
              onChange={handleChange}
              min={1}
              required
              style={{ width: '30%', marginLeft: '1%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '5px' }}>
          <label>
            Price per portion :
            <Input
              type="number"
              id={'pricePerPortion'}
              value={pricePerPortion}
              onChange={handleChange}
              min={1}
              style={{ width: '30%', marginLeft: '1%' }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Number of portions :
            <Input
              type="number"
              placeholder="nb of portions"
              id={'defaultPortionNumber'}
              value={defaultPortionNumber}
              onChange={handleChange}
              min={1}
              style={{ width: '30%', marginLeft: '1%' }}
              required
            />
          </label>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px'
          }}
        >
          <Checkbox checked={canBeFrozen} onChange={handleChange}>
            can be frozen
          </Checkbox>
          <Checkbox
            checked={vegan}
            onChange={event =>
              handleChangeInNestedState(event, 'categories', 'vegan')
            }
          >
            vegan
          </Checkbox>
          <Checkbox
            checked={healthy}
            onChange={event =>
              handleChangeInNestedState(event, 'categories', 'healthy')
            }
          >
            healthy
          </Checkbox>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            File :{' '}
            <input
              type="file"
              onChange={handleFile}
              required
              style={{ width: '60%' }}
            />
          </label>
          {isLoading && <span>currenlty loading</span>}
        </div>
        <Button
          style={{ alignSelf: 'center' }}
          disabled={isLoading}
          type="primary"
          htmlType="submit"
          top="10px"
        >
          SUBMIT RECIPE
        </Button>
      </Form>
    </FormContainer>
  );
};

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0px 5px 0px;
  margin-bottom: 5px;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin: auto;
`;

const FormContainer = styled.div`
  margin: auto;
  max-width: 500px;
  padding: 5px;
`;
export const AddRecipeForm = compose(withRouter)(AddRecipeFormBase);
