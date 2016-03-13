import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import update from 'react-addons-update';

// TODO: flowtypeつかう

export const initialState = {
  packages: [],
  query: {
    keyword: '',
  },
};
export function createPromiseStore() {
  return createStore((state, action) => {
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
  }, initialState, applyMiddleware(promiseMiddleware));
}

export default createPromiseStore();
