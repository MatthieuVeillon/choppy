export const FIREBASE_API = 'FIREBASE_API';
export const FIREBASE_API_ERROR = 'FIREBASE_API_ERROR';

export const doSetFirebaseApiError = error => ({
  type: FIREBASE_API_ERROR,
  payload: {
    error: error
  }
});

export const apiFirebaseReducer = (state = '', action) => {
  switch (action.type) {
    case FIREBASE_API_ERROR:
      return {
        ...state,
        error: action
      };
    default:
      return state;
  }
};
