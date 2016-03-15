import React from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';

import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import * as Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

import Header from './Header';
import Trending from './Trending';
import Footer from './Footer';

import axios from 'axios';

// server -> production ? 'http://npm-today.berabou.me/downloads' : 'http://localhost:{process.env.PORT}/downloads'
// client -> webpackDev ? '/downloads' : 'http://npm-today.berabou.me/downloads'
const url = process.env.NODE_ENV === 'production' ? `${process.env.URL}/downloads` : 'http://npm-today.berabou.me/downloads';

class Container extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    location: React.PropTypes.object.isRequired,
    routeParams: React.PropTypes.object.isRequired,
    date: React.PropTypes.string,
    query: React.PropTypes.object,
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
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

  // urlの日付(:date)とキーワード(?keyword)をstateとして優先する
  // 日付の指定がなければ最新日を取得後、storeのstateとして使う
  componentWillMount() {
    let promise;
    if (this.props.routeParams.date) {
      promise = Promise.resolve(this.props.routeParams.date);
    } else {
      promise = axios(`${url}/last-day`).then((response) => response.data);
    }

    this.props.dispatch({
      type: 'search',
      payload: {
        query: this.props.location.query,
      },
    });

    this.props.dispatch(
      promise.then((date) =>
        axios(`${url}/${date}`)
        .then((response) => ({
          type: 'update',
          payload: {
            date,
            query: this.props.location.query,
            packages: response.data,
          },
        })
      ))
    );
  }

  // urlが変更されたら、storeに反映する。
  componentWillReceiveProps(nextProps) {
    const { routeParams, location } = nextProps;

    // router.pushでurlの検索ワード(?keyword)の変更があったとき
    if (location.query && location.query.keyword !== this.props.location.query.keyword) {
      return this.props.dispatch({
        type: 'search',
        payload: {
          query: location.query,
        },
      });
    }

    // router.pushでurlの日付(:date)の変更があったとき
    if (routeParams.date && routeParams.date !== this.props.routeParams.date) {
      // TODO: invalid date extra validation
      if (routeParams.date.match(/\d{4}-\d{2}-\d{2}/) === null) {
        return this.context.router.push('/404');
      }

      // re-show CircularProgress
      this.props.dispatch({
        type: 'update',
        payload: {
          packages: [],
        },
      });

      return this.props.dispatch(
        axios(`${url}/${routeParams.date}`)
        .then(({ data: packages }) => ({
          type: 'update',
          payload: {
            date: routeParams.date,
            packages,
          },
        }))
      );
    }

    return true;
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <Trending {...this.props} />
        <Footer {...this.props} />
      </div>
    );
  }
}

export default connect(
  state => state,
)(Container);
