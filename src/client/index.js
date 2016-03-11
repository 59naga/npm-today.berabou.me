import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Router from './Router';
import './index.styl';

injectTapEventPlugin();

window.addEventListener('load', () => {
  ReactDOM.render(<Router />, document.querySelector('#container'));
});
