import { Button, Input, Select } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash';
import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { Box, FormField } from '../BasicComponents/Box';
import { CheckboxSlider } from '../CheckboxSlider';
import { recipesContext } from '../Context/RecipesContext';
import { database } from '../firebase';
import { storageRef } from '../firebase/index';
import { CookingStepField } from '../FormInput/CookingStepField';
import { ImageInput } from '../FormInput/ImageInput';
import { IngredientField } from '../FormInput/IngredientField';
import { useFirebasePOSTApi } from '../Recipe/useFirebaseApi';

const InputGroup = Input.Group;
const { Option } = Select;

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

const AddRecipeFormBase = ({ history, form }) => {
  const [newRecipe, setNewRecipe] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { setRecipes } = useContext(recipesContext);

  //setup to post recipe on firebase
  const key = database.ref('/recipes/').push().key;
  const endpoint = database.ref('/recipes/' + key);
  const recipeWithId = addIdToRecipeAndIngredients(newRecipe, key);
  const [postNewRecipe] = useFirebasePOSTApi(endpoint, recipeWithId);

  const handleSubmit = event => {
    event.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        postNewRecipe();
        setRecipes(prevState => prevState.concat(newRecipe));
        history.push('/');
      }
    });
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
    <form style={{ margin: '5px' }} onSubmit={handleSubmit}>
      <Input
        type="text"
        value={title}
        placeholder="title"
        id="title"
        onChange={handleChange}
      />

      <IngredientsList>
        {newRecipe.ingredients.map((ingredient, index) => (
          <IngredientField
            key={index}
            ingredient={ingredient}
            index={index}
            handleChangeInDynamicElement={handleChangeInDynamicElement}
            handleRemoveItem={handleRemoveItem}
          />
        ))}
      </IngredientsList>

      <Button size="small" onClick={() => handleAddItem('ingredients')}>
        Add Ingredient
      </Button>

      <CookingStepFieldsList>
        {newRecipe.cookingSteps.map((step, index) => (
          <CookingStepField
            key={index}
            step={step}
            index={index}
            handleChangeInDynamicElement={handleChangeInDynamicElement}
            handleRemoveItem={handleRemoveItem}
          />
        ))}
      </CookingStepFieldsList>
      <Button size="small" onClick={() => handleAddItem('cookingSteps')}>
        Add Step
      </Button>

      <FormField
        top="8px"
        type="number"
        value={cookingTime}
        onChange={handleChange}
        id="cookingTime"
        placeholder={'cooking time in min'}
        required
      />

      <FormField
        top="8px"
        type="number"
        value={pricePerPortion}
        onChange={handleChange}
        id="pricePerPortion"
        placeholder={'price per portion'}
        required
      />
      <FormField
        top="8px"
        type="number"
        value={defaultPortionNumber}
        onChange={handleChange}
        id="defaultPortionNumber"
        placeholder="number of portion"
        required
      />
      <Box top="8px" width="300px" spaceBetween>
        <CheckboxSlider
          name="canBeFrozen"
          onChange={handleChange}
          value={canBeFrozen}
        />
        <CheckboxSlider
          name="Vegan"
          onChange={event =>
            handleChangeInNestedState(event, 'categories', 'vegan')
          }
          value={vegan}
        />
        <CheckboxSlider
          name="Healthy"
          onChange={event =>
            handleChangeInNestedState(event, 'categories', 'healthy')
          }
          value={healthy}
        />
      </Box>
      <ImageInput
        name="picture: "
        onChange={handleFile}
        required
        isLoading={isLoading}
      />
      <Button type="primary" disabled={isLoading} type="submit" top="10px">
        SUBMIT RECIPE
      </Button>
    </form>
  );
};

const IngredientsList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0px 5px 0px;
`;

const CookingStepFieldsList = styled(IngredientsList)``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 5px;
`;

export const AddRecipeForm = compose(withRouter)(AddRecipeFormBase);
