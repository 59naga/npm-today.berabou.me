import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import update from 'react-addons-update';

export const initialState = {
  packages: [],
  query: '',
};
export function createPromiseStore() {
  return createStore((state, action) => {
    switch (action.type) {
      case 'search':
        {
          const { query } = action.payload || {};
          if (typeof query !== 'string') {
            throw new TypeError(`invalid argument type: query is ${typeof query}`);
          }
          return update(state, { $merge: { query } });
        }

      case 'update':
        {
          const { packages } = action.payload || {};
          if (packages instanceof Array === false) {
            throw new TypeError(`invalid argument type: packages is ${typeof packages}`);
          }
          return update(state, { $merge: { packages } });
        }

      case 'redirect':
        {
          const { date } = action.payload || {};
          if (!date || date.match(/\d{4}-\d{2}-\d{2}/) === null) {
            throw new TypeError("invalid argument type: date isnt match 'YYYY-MM-DD'");
          }
          return update(state, { $merge: { date } });
        }

      default:
        return state;
    }
  }, initialState, applyMiddleware(promiseMiddleware));
}

export default createPromiseStore();
