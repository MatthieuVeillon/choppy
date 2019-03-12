import { doFetchAllRecipes } from './reducer/recipe-reducer';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

export const withRecipeData = Component =>
  compose(
    connect(state => ({ areRecipesLoaded: state.recipes.recipes })),
    lifecycle({
      componentDidMount() {
        const { dispatch, areRecipesLoaded } = this.props;
        if (!areRecipesLoaded) {
          dispatch(doFetchAllRecipes());
        }
      }
    })
  )(Component);
