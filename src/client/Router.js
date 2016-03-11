import React from 'react';
import { Router, Route, hashHistory } from 'react-router';

import Container from './components/Container';

export default () => (
  <Router history={hashHistory}>
    <Route path="/" component={Container} />
    <Route path="/:date" component={Container} />
  </Router>
);
