import { doSetFirebaseApiError, FIREBASE_API } from './apiFirebase-reducer';

export const apiFirebaseMiddleware = ({ dispatch }) => next => action => {
  next(action);

  if (action.type !== FIREBASE_API) {
    return;
  }
  const { firebaseMethod, onSuccess, firebaseType, data } = action.payload;
  if (firebaseType === 'GET') {
    firebaseMethod().then(snapshot => dispatch(onSuccess(snapshot.val())));
  }

  if (firebaseType === 'POST') {
    firebaseMethod()
      .then(() => dispatch(onSuccess()))
      .catch(error => {
        console.log('error', error);
        return dispatch(doSetFirebaseApiError(error));
      });
  }
};
