import { compose, lifecycle } from "recompose";
import { firebase } from "../firebase";
import { connect } from "react-redux";
import { AUTH_USER_SET } from "./reducer/session-reducer";

export const withAuthentication = Component =>
  compose(
    connect(
      null,
      dispatch => ({
        onSetAuthUser: authUser => dispatch({ type: AUTH_USER_SET, authUser })
      })
    ),
    lifecycle({
      componentDidMount() {
        const { onSetAuthUser } = this.props;
        firebase.auth.onAuthStateChanged(authUser => {
          authUser ? onSetAuthUser(authUser) : onSetAuthUser(null);
        });
      }
    })
  )(Component);
