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
    date: React.PropTypes.string,
    location: React.PropTypes.object.isRequired,
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
    // routeParams.dateでデータ取得を試みる
    // store.dispatch(this.update(this.props.routeParams.date, conditions));

    // routeParams.dateとstore.dateが一致しない時、packagesを更新する
    let date = null;
    store.subscribe(() => {
      if (date !== store.getState().date) {
        store.dispatch(this.update(store.getState().date));
      }

      date = store.getState().date;
    });

    // 初期化。日付と検索条件で描写を試みる
    store.dispatch({
      type: 'redirect',
      payload: {
        date: this.props.routeParams.date,
        query: this.props.location.query,
        packages: [],
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.keyword !== nextProps.location.query.keyword) {
      return store.dispatch({
        type: 'search',
        payload: {
          query: nextProps.location.query,
        },
      });
    }

    return store.dispatch({
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
        <Header {...this.props} store={store} />
        <Trending {...this.props} store={store} />
        <Footer {...this.props} store={store} />
      </div>
    );
  }
}

export default Container;
