import { connect } from "react-redux";
import { setCategoryFilter } from "../actions";
import Link from "../components/Link";

const mapStateToProps = (state,ownProps) => {
    return {
        active:ownProps.filter === state.categoryFilter
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(setCategoryFilter(ownProps.category))
        }
    }
}


const CategoryFilter = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link);

export default CategoryFilter;