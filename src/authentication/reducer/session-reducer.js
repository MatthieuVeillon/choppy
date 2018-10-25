const INITIAL_STATE = { authUser: null };

export const AUTH_USER_SET = "AUTH_USER_SET";

const applySetAuthUser = (state, action) => ({
  ...state,
  authUser: action.authUser
});

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER_SET: {
      return applySetAuthUser(state, action);
    }
    default:
      return state;
  }
}
export default sessionReducer;
