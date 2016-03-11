import React from 'react';
import { connect } from 'react-redux';

import { createResult } from '../helpers/factory';

import { Paper } from 'material-ui';
import { List } from 'material-ui';

class Trending extends React.Component {
  static propTypes = {
    packages: React.PropTypes.array,
  }

  render() {
    return (
      <List style={{ margin: '64px 0' }}>
        <Paper style={{ margin: '1em 2em' }} zDepth={1}>
          {createResult(this.props.packages, this.props)}
        </Paper>
      </List>
    );
  }
}

export default connect(
  state => state,
)(Trending);
