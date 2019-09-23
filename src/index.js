import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as routes from './constants/routes';

ReactDOM.render(
  <Router>
    <Route path={routes.HOME} component={App} />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();
