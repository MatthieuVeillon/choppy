import { database } from "../../firebase/index";

const applySetUsers = (state, action) => ({ ...state, user: action.username });

//Actions
export const CREATE_USER_STARTED = "CREATE_USER_STARTED";
export const CREATE_USER_FAILED = "CREATE_USER_FAILED";
export const CREATE_USER_COMPLETED = "CREATE_USER_COMPLETED";
//Actions Creator

const addUserStarted = () => ({ type: CREATE_USER_STARTED });
const addUserFailed = () => ({ type: CREATE_USER_FAILED });
const addUserCompleted = username => ({
  type: CREATE_USER_COMPLETED,
  username
});

//reducer
const INITIAL_STATE = { user: {} };

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_USER_STARTED:
      return {
        ...state,
        inProgress: true,
        error: "",
        success: ""
      };
    case CREATE_USER_FAILED:
      return {
        ...state,
        inProgress: false,
        error: "Error in getting recipes"
      };
    case CREATE_USER_COMPLETED:
      return applySetUsers(state, action);
    default:
      return state;
  }
};

//Side Effects
export const createUserInDB = (id, username) => {
  return dispatch => {
    dispatch(addUserStarted());
    const usersListRef = database.ref(`users/${id}`);
    usersListRef
      .set({ username })
      .then(() => dispatch(addUserCompleted(username)))
      .catch(error => {
        console.log(error);
        return dispatch(addUserFailed());
      });
  };
};
