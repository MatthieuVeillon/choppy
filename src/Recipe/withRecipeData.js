import { doFetchAllRecipes } from './reducer/recipe-reducer';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

export const withRecipeData = Component =>
  compose(
    connect(),
    lifecycle({
      componentDidMount() {
        const { dispatch } = this.props;
        dispatch(doFetchAllRecipes());
      }
    })
  )(Component);
