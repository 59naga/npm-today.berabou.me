// dependencies
import assert from 'power-assert';
import dispatchAsync from './utils/dispatchAsync';

// target
import { initialState, createPromiseStore } from '../../src/client/store';

// specs
describe('redux-store', () => {
  let store;
  beforeEach(() => {
    store = createPromiseStore();
  });

  describe('type: serach', () => {
    const type = 'search';

    it('payload: accepts only `query`', () => {
      const query = 'nanka';

      return dispatchAsync(store, {
        type,
        payload: { query, dummy: 'kaboom' },
      })
      .then(() => {
        const state = store.getState();

        assert.deepEqual(state, Object.assign({}, initialState, { query }));
      });
    });

    it('payload: if missing `query`, should throw an TypeError', () => {
      return dispatchAsync(store, {
        type,
      })
      .catch((error) => {
        assert(error instanceof TypeError);
        assert(error.message === `invalid argument type: query is ${typeof query}`);
      });
    });
  });

  describe('type: update', () => {
    const type = 'update';

    it('payload: accepts only `packages`', () => {
      const packages = ['nanka'];

      return dispatchAsync(store, {
        type,
        payload: { packages, dummy: 'kaboom' },
      })
      .then(() => {
        const state = store.getState();
        assert.deepEqual(state, Object.assign({}, initialState, { packages }));
      });
    });

    it('payload: if missing `packages`, should throw an TypeError', () => {
      return dispatchAsync(store, {
        type,
      })
      .catch((error) => {
        assert(error instanceof TypeError);
        assert(error.message === `invalid argument type: packages is ${typeof packages}`);
      });
    });
  });

  describe('type: redirect', () => {
    const type = 'redirect';

    it('payload: accepts only `date`', () => {
      const date = '1990-09-18';

      return dispatchAsync(store, {
        type,
        payload: { date, dummy: 'kaboom' },
      })
      .then(() => {
        const state = store.getState();
        assert.deepEqual(state, Object.assign({}, initialState, { date }));
      });
    });

    it('payload: if missing `date`, should throw an TypeError', () => {
      return dispatchAsync(store, {
        type,
      })
      .catch((error) => {
        assert(error instanceof TypeError);
        assert(error.message === "invalid argument type: date isnt match 'YYYY-MM-DD'");
      });
    });
  });
});
