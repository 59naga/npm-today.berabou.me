import React from 'react';
import { connect } from 'react-redux';

import { AppBar } from 'material-ui';
import { IconButton } from 'material-ui';
import { TextField } from 'material-ui';

class Footer extends React.Component {
  static propTypes = {
    location: React.PropTypes.object.isRequired,
    query: React.PropTypes.object,
  }
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  handleSubmit(event) {
    event.preventDefault();

    this.context.router.replace({
      pathname: this.props.location.pathname,
      query: Object.assign(
        {},
        this.props.location.query,
        {
          keyword: this.refs.keyword.input.value,
        }
      ),
    });
  }
  render() {
    return (
      <AppBar
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}

        iconElementLeft={<div />}
        title={
          <form onSubmit={::this.handleSubmit}>
            <span>npm-today</span>
            <a href="https://registry.npmjs.org/-/all/static/today.json"></a>
            <TextField
              autoFocus
              ref="keyword"
              style={{ margin: '0 2em' }}
              hintStyle={{ color: 'rgba(255,255,255,.5)' }}
              hintText="filter by name, authors, keywords..."
              inputStyle={{ color: 'white' }}

              defaultValue={this.props.query ? this.props.query.keyword : null}
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
            tooltipPosition="top-left"
          >device_hub</IconButton>
        }
      />
    );
  }
}

export default connect(
  (state) => state,
)(Footer);
