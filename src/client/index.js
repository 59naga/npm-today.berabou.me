import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Trending from './Trending';

import './index.styl';

injectTapEventPlugin();

window.addEventListener('load', () => {
  ReactDOM.render(<Trending />, document.querySelector('#container'));
});
