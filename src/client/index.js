import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import createStore from './store';

import injectTapEventPlugin from 'react-tap-event-plugin';
import './index.styl';

injectTapEventPlugin();

window.addEventListener('load', () => {
  ReactDOM.render(
    (
      <Provider store={createStore()}>
        <Router history={browserHistory} routes={routes} />
      </Provider>
    ),
    document.querySelector('#container'),
  );
});
