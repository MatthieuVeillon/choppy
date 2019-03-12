import { connect } from 'react-redux';
import Link from '../Link';
import { setCategoryFilter } from './categoryFilter-reducer';

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.category === state.categoryFilter
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setCategoryFilter(ownProps.category));
    }
  };
};

const CategoryFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);

export default CategoryFilter;
