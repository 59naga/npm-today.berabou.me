import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import update from 'react-addons-update';

export default createStore((state, action) => {
  switch (action.type) {
    case 'search':
      return update(state, { $merge: action.payload });
    case 'update':
      return update(state, { $merge: action.payload });
    case 'redirect':
      return update(state, { $merge: action.payload });

    default:
      return state;
  }
}, {
  packages: [],
  query: '',
}, applyMiddleware(promiseMiddleware));
