// dependencies
import './utils/document';
import dispatchAsync from './utils/dispatchAsync';
import React from 'react';
import { mount } from 'enzyme';
import assert from 'power-assert';

import { CircularProgress } from 'material-ui';

// private
const dispatchUpdateAndSearch = (store, packages, query) => (
  dispatchAsync(store, {
    type: 'update',
    payload: {
      packages,
    },
  })
  .then(() => (
    dispatchAsync(store, {
      type: 'search',
      payload: {
        query,
      },
    })
  ))
);
const packages = [
  {
    name: 'hoge',
    author: 'Lorem',
    maintainers: ['johndue', 'hoge-Lorem-maintainer'],
    keywords: ['要反省である'],
    downloads: 1,
  },
  {
    name: 'fuga',
    author: 'ipsum',
    maintainers: ['johndue', 'fuga-ipsum-maintainer'],
    keywords: ['加速した'],
    downloads: 2,
  },
  {
    name: 'piyo',
    author: 'dolor',
    maintainers: ['johndue', 'piyo-dolor-maintainer'],
    keywords: ['アイエエエ'],
    downloads: 3,
  },
];

// target
import { createPromiseStore } from '../../src/client/store';
import { ListItem } from 'material-ui';
import Trending from '../../src/client/components/Trending';

// specs
describe('<Trending />', () => {
  let store;
  beforeEach(() => {
    store = createPromiseStore();
  });

  it('if packages is empty, should render circular-progress', () => {
    const wrapper = mount(<Trending store={store} />);

    return dispatchAsync(store, {
      type: 'update',
      payload: {
        packages: [],
      },
    })
    .then(() => {
      assert(wrapper.find(CircularProgress).get(0));
    });
  });

  it('should render an ListItem equal to the number of packages ', () => {
    const wrapper = mount(<Trending store={store} />);

    return dispatchAsync(store, {
      type: 'update',
      payload: {
        packages,
      },
    })
    .then(() => {
      assert(wrapper.find(ListItem).length === packages.length);
    });
  });

  it('if dispatch search(query), rendered only matching(name) package', () => {
    const wrapper = mount(<Trending store={store} />);
    const query = 'hoge';

    return dispatchUpdateAndSearch(store, packages, query)
    .then(() => {
      const listItems = wrapper.find(ListItem);
      assert(listItems.length === 1);
      assert(listItems.prop('primaryText') === query);
    });
  });

  it('if dispatch search(query), rendered only matching(author) package', () => {
    const wrapper = mount(<Trending store={store} />);
    const query = 'ipsum';

    return dispatchUpdateAndSearch(store, packages, query)
    .then(() => {
      const listItems = wrapper.find(ListItem);
      assert(listItems.length === 1);
      assert(listItems.prop('author') === query);
    });
  });

  it('if dispatch search(query), rendered only matching(maintaners) package', () => {
    const wrapper = mount(<Trending store={store} />);
    const query = 'hoge-Lorem-maintainer';

    return dispatchUpdateAndSearch(store, packages, query)
    .then(() => {
      const listItems = wrapper.find(ListItem);
      assert(listItems.length === 1);
      assert(listItems.prop('maintainers').indexOf(query) > -1);
    });
  });

  it('if dispatch search(query), rendered only matching(keywords) package', () => {
    const wrapper = mount(<Trending store={store} />);
    const query = 'アイエエエ';

    return dispatchUpdateAndSearch(store, packages, query)
    .then(() => {
      const listItems = wrapper.find(ListItem);
      assert(listItems.length === 1);
      assert(listItems.prop('keywords').indexOf(query) > -1);
    });
  });
});
