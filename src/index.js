import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import { rootReducer } from './rootReducer/rootReducer';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as routes from './constants/routes';
import { apiFirebaseMiddleware } from './apiFirebase/apiFirebase-middleware';
import actionArrayMiddleware from './apiFirebase/actionArrayMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      actionArrayMiddleware,
      apiFirebaseMiddleware
    )
  )
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path={routes.HOME} component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
