// dependencies
import Promise from 'Bluebird';

/**
* @function dispatchAsync
* @param {object} store - redux store instance
* @param {object} action - {type,payload}
* @returns {promise<undefined>} - fulfill is dispatched
*/
export default (store, action) => (
  new Promise((resolve) => {
    const unsubscribe = store.subscribe(() => {
      unsubscribe();
      resolve();
    });

    store.dispatch(action);
  })
);
