import React from 'react';
import axios from 'axios';

import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import * as Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

import { createResult } from './factory';

import { AppBar } from 'material-ui';
import { Paper } from 'material-ui';
import { IconButton } from 'material-ui';
import { TextField } from 'material-ui';
import { List } from 'material-ui';

export default class Trending extends React.Component {
  static get childContextTypes() {
    return { muiTheme: React.PropTypes.object };
  }

  constructor() {
    super();

    this.state = {
      packages: [],
      query: '',
      selectedIndex: 1,
    };
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
    const url = process.env.NODE_ENV === 'production' ? 'downloads' : 'http://npm-today.berabou.me/downloads';
    axios(url) // fetch `/downloads` in ../server/index.js
    .then((response) => {
      this.setState({ packages: response.data });
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    const query = this.refs.query.input.value;// via ReactClassComponent

    this.setState({ query });
  }
  render() {
    return (
      <div>
        <AppBar
          style={{ position: 'fixed', top: '0', left: '0', right: '0' }}

          iconElementLeft={<div />}
          title={
            <form onSubmit={::this.handleSubmit}>
              <span>npm-today</span>
              <a href="https://registry.npmjs.org/-/all/static/today.json"></a>
              <TextField
                autoFocus
                ref="query"
                style={{ margin: '0 2em' }}
                hintStyle={{ color: 'rgba(255,255,255,.5)' }}
                hintText="filter by name, authors, keywords..."
                inputStyle={{ color: 'white' }}
              />
            </form>
          }

          iconElementRight={
            <IconButton
              linkButton
              href="https://github.com/59naga/npm-today.berabou.me"
              iconClassName="material-icons"
              iconStyle={{ color: 'white' }}
              tooltip="fookme on github"
              tooltipPosition="bottom-left"
            >device_hub</IconButton>
          }
        />
        <List style={{ margin: '64px 0' }}>
          <Paper style={{ margin: '1em 2em' }} zDepth={1}>
            {createResult(this.state.packages, this.state)}
          </Paper>
        </List>
        <AppBar
          style={{ position: 'fixed', bottom: '0', left: '0', right: '0' }}

          iconElementLeft={
            <IconButton
              href="https://github.com/59naga/npm-today.berabou.me"
              iconClassName="material-icons"
              iconStyle={{ color: 'white' }}
              tooltip="yesterday"
              tooltipPosition="top-right"
            >keyboard_arrow_left</IconButton>
          }
          title={
            <span>2016-03-07</span>
          }

          iconElementRight={
            <IconButton
              href="https://github.com/59naga/npm-today.berabou.me"
              iconClassName="material-icons"
              iconStyle={{ color: 'white' }}
              tooltip="tommorow"
              tooltipPosition="top-left"
            >keyboard_arrow_right</IconButton>
          }
        />
      </div>
    );
  }
}
