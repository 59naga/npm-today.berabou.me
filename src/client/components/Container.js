import React from 'react';

import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import * as Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

import store from '../store';
import Header from './Header';
import Trending from './Trending';
import Footer from './Footer';

import axios from 'axios';

// environment
const url = process.env.NODE_ENV === 'production' ? 'downloads' : 'http://npm-today.berabou.me/downloads';

class Container extends React.Component {
  static propTypes = {
    date: React.PropTypes.string,
    location: React.PropTypes.object.isRequired,
    routeParams: React.PropTypes.object.isRequired,
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

  componentWillMount() {
    this.update(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.update(nextProps);
  }

  update(props) {
    const { routeParams, location } = props;

    if (this.props.location.query.keyword !== location.query.keyword) {
      return store.dispatch({
        type: 'search',
        payload: {
          query: location.query,
        },
      });
    }

    if (routeParams.date) {
      // TODO: invalid date extra validation
      if (routeParams.date.match(/\d{4}-\d{2}-\d{2}/) === null) {
        return this.context.router.push('/404');
      }

      return store.dispatch(
        axios(`${url}/${routeParams.date}`)
        .then(({ data: packages }) => ({
          type: 'update',
          payload: {
            date: routeParams.date,
            query: location.query,
            packages,
          },
        }))
      );
    }

    // fetch packages after fetch last-day
    return store.dispatch(
      axios(`${url}/last-day`)
      .then(({ data: date }) => (
        axios(`${url}/${date}`)
        .then((response) => ({
          type: 'update',
          payload: {
            date,
            query: location.query,
            packages: response.data,
          },
        }))
      ))
    );
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
