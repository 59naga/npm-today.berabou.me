// dependencies
import assert from 'power-assert';

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

    it('payload: accepts only `query`', (done) => {
      const query = 'nanka';

      setTimeout(() => {
        store.dispatch({
          type,
          payload: { query, dummy: 'kaboom' },
        });
      });

      const unsubscribe = store.subscribe(() => {
        const state = store.getState();

        assert.deepEqual(state, Object.assign({}, initialState, { query }));

        unsubscribe();
        done();
      });
    });

    it('payload: if missing `query`, should throw an TypeError', (done) => {
      setTimeout(() => {
        try {
          store.dispatch({
            type,
          });
        } catch (error) {
          assert(error instanceof TypeError);
          assert(error.message === `invalid argument type: query is ${typeof query}`);
          done();
        }
      });
    });
  });

  describe('type: update', () => {
    const type = 'update';

    it('payload: accepts only `packages`', (done) => {
      const packages = ['nanka'];

      setTimeout(() => {
        store.dispatch({
          type,
          payload: { packages, dummy: 'kaboom' },
        });
      });

      const unsubscribe = store.subscribe(() => {
        const state = store.getState();

        assert.deepEqual(state, Object.assign({}, initialState, { packages }));

        unsubscribe();
        done();
      });
    });

    it('payload: if missing `packages`, should throw an TypeError', (done) => {
      setTimeout(() => {
        try {
          store.dispatch({
            type,
          });
        } catch (error) {
          assert(error instanceof TypeError);
          assert(error.message === `invalid argument type: packages is ${typeof packages}`);
          done();
        }
      });
    });
  });

  describe('type: redirect', () => {
    const type = 'redirect';

    it('payload: accepts only `date`', (done) => {
      const date = '1990-09-18';

      setTimeout(() => {
        store.dispatch({
          type,
          payload: { date, dummy: 'kaboom' },
        });
      });

      const unsubscribe = store.subscribe(() => {
        const state = store.getState();

        assert.deepEqual(state, Object.assign({}, initialState, { date }));

        unsubscribe();
        done();
      });
    });

    it('payload: if missing `date`, should throw an TypeError', (done) => {
      setTimeout(() => {
        try {
          store.dispatch({
            type,
          });
        } catch (error) {
          assert(error instanceof TypeError);
          assert(error.message === "invalid argument type: date isnt match 'YYYY-MM-DD'");
          done();
        }
      });
    });
  });
});
