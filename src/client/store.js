import { createStore, applyMiddleware } from 'redux';
import hermit from 'redux-hermit';
import update from 'react-addons-update';

export const initialState = {
  packages: [],
};
export default () => (
  createStore(
    (state, action) => {
      switch (action.type) {
        case 'search':
        case 'update':
          return update(state, { $merge: action.payload });

        default:
          return state;
      }
    },
    initialState,
    applyMiddleware(hermit),
  )
);
