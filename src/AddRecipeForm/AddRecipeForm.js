import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { recipesContext } from '../Context/RecipesContext';
import { compose } from 'recompose';
import uuid from 'uuid/v4';
import { Box, Button, FormField } from '../BasicComponents/Box';
import { Form } from '../BasicComponents/Form';
import { CheckboxSlider } from '../CheckboxSlider';
import { database } from '../firebase';
import { storageRef } from '../firebase/index';
import { CookingStepField } from '../FormInput/CookingStepField';
import { ImageInput } from '../FormInput/ImageInput';
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
const AddRecipeFormBase = props => {
  const [newRecipe, setNewRecipe] = useState(initialState);
  const { setRecipes } = useContext(recipesContext);

  //setup to post recipe on firebase
  const key = database.ref('/recipes/').push().key;
  const endpoint = database.ref('/recipes/' + key);
  const recipeWithId = addIdToRecipeAndIngredients(newRecipe, key);
  const [postNewRecipe] = useFirebasePOSTApi(endpoint, recipeWithId);

  const handleSubmit = event => {
    postNewRecipe();
    setRecipes(prevState => prevState.concat(newRecipe));
    props.history.push('/');
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

    storageRef
      .ref()
      .child(`${file.name}`)
      .put(file)
      .then(() =>
        storageRef
          .ref()
          .child(`${file.name}`)
          .getDownloadURL()
          .then(url =>
            setNewRecipe(prevState => {
              return { ...prevState, uploadImageUrl: url };
            })
          )
      );
  };
  const handleChangeInDynamicElement = (event, index, name, arrayToMap) => {
    const newItems = newRecipe[arrayToMap].map((item, secondIndex) => {
      if (index !== secondIndex) return item;
      return { ...item, [name]: event.target.value };
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
    <Form onSubmit={handleSubmit}>
      <FormField
        type="text"
        value={title}
        onChange={handleChange}
        id="title"
        placeholder={'title'}
        required
        width="250px"
      />

      {newRecipe.ingredients.map((ingredient, index) => (
        <IngredientField
          key={index}
          ingredient={ingredient}
          index={index}
          handleChangeInDynamicElement={handleChangeInDynamicElement}
          handleRemoveItem={handleRemoveItem}
        />
      ))}

      <button
        type="button"
        onClick={() => handleAddItem('ingredients')}
        className="small"
      >
        Add Ingredient
      </button>

      {newRecipe.cookingSteps.map((step, index) => (
        <CookingStepField
          key={index}
          step={step}
          index={index}
          handleChangeInDynamicElement={handleChangeInDynamicElement}
          handleRemoveItem={handleRemoveItem}
        />
      ))}

      <button
        type="button"
        onClick={() => handleAddItem('cookingSteps')}
        className="small"
      >
        Add Step
      </button>

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

      <ImageInput name="picture: " onChange={handleFile} required />

      <Button primary type="submit" top="10px">
        SUBMIT RECIPE
      </Button>
    </Form>
  );
};

export const AddRecipeForm = compose(withRouter)(AddRecipeFormBase);
