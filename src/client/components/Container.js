import React from 'react';

import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import * as Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

import store from '../store';
import Header from './Header';
import Trending from './Trending';
import Footer from './Footer';

import axios from 'axios';

class Container extends React.Component {
  static propTypes = {
    routeParams: React.PropTypes.object.isRequired,
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme({
        palette: {
          primary1Color: Colors.indigo500,
          primary2Color: Colors.indigo700,
          primary3Color: Colors.indigo900,
          disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.4),
        },
      }),
    };
  }

  componentWillMount() {
    let date = store.getState().date;

    store.dispatch(this.update(this.props.routeParams.date));
    store.subscribe(() => {
      if (date !== store.getState().date) {
        store.dispatch(this.update(store.getState().date));
      }

      date = store.getState().date;
    });
  }
  componentWillReceiveProps(nextProps) {
    store.dispatch({
      type: 'redirect',
      payload: {
        date: nextProps.routeParams.date,
        packages: [],
      },
    });
  }

  update(date = 'last-day') {
    const url = process.env.NODE_ENV === 'production' ? 'downloads' : 'http://npm-today.berabou.me/downloads';
    const uri = `${url}/${date}`;

    return axios(uri) // fetch `/downloads` in ../server/index.js
    .then((response) => {
      if (typeof response.data === 'string') {
        return {
          type: 'redirect',
          payload: {
            date: response.data,
            packages: [],
          },
        };
      }

      return {
        type: 'update',
        payload: {
          date,
          packages: response.data,
        },
      };
    });
  }

  render() {
    return (
      <div>
        <Header store={store} />
        <Trending store={store} />
        <Footer store={store} />
      </div>
    );
  }
}

export default Container;
