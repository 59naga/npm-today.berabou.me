import React from 'react';
import update from 'react-addons-update';

import { ListItem } from 'material-ui';
import { Divider } from 'material-ui';
import { CircularProgress } from 'material-ui';

/**
* @param {object} pkg - package infomation chunk using `today.json`
* @return {string} maintaners string
* @see https://registry.npmjs.org/-/all/static/today.json
*/
export function getMaintainers(pkg) {
  if (pkg.maintainers) {
    return pkg.maintainers.map((maintainer) => {
      if (typeof maintainer === 'string') {
        return maintainer.split(' <')[0];
      }

      return maintainer.name;
    }).join(', ');
  }

  if (pkg.author) {
    if (typeof pkg.author === 'string') {
      return pkg.author.split(' <')[0];
    }

    return pkg.author.name;
  }

  return 'unknown';
}


/**
* transform the package to <ListItem />
*
* @function createResult
* @param {array<pkg>} packages
* @param {object} [options]
* @param {string} [options.query.keyword='']
* @return {array<MaterialUI:ListItem>} listItems
*/
export function createResult(packages, options = {}) {
  const opts = update({
    query: {
      keyword: '',
    },
  }, {
    query: {
      $merge: options.query || {},
    },
  });

  let total = 0;
  let count = 0;
  const listItems = [];
  packages.slice(0, 100).forEach((pkg, i) => {
    total += pkg.downloads;
    if (pkg.downloads <= 0) {
      return undefined;
    }
    if (opts.query.keyword) {
      const matchName = pkg.name.match(opts.query.keyword) !== null;
      const matchDescription = (pkg.description || '').match(opts.query.keyword) !== null;
      const matchKeyword = (pkg.keywords || []).join(', ').match(opts.query.keyword) !== null;
      const matchMaintaner = getMaintainers(pkg).match(opts.query.keyword) !== null;
      const unMatch = (matchName || matchDescription || matchKeyword || matchMaintaner) === false;
      if (unMatch) {
        return undefined;
      }
    }
    count++;

    // TODO: Case of multiple values ``{"6.7.7":"latest","6.7.2":"stable"}`
    const latest = Object.keys(pkg.versions)[0];

    listItems.push(
      <ListItem
        {...pkg}

        key={pkg.name}
        value={i}
        primaryText={`${pkg.name}@${latest}`}
        secondaryText={<p>{pkg.description}</p>}
        leftAvatar={<div className="numeric">{(i + 1).toLocaleString()}</div>}
        rightAvatar={<div>{pkg.downloads.toLocaleString()}</div>}

        target="_blank"
        href={`https://www.npmjs.com/package/${pkg.name}`}
      />
    );
    return listItems.push(<Divider key={`${pkg.name}d`} />);
  });

  if (listItems.length) {
    return listItems;
  } else if (packages.length) {
    return <ListItem primaryText="no results found" />;
  }

  return (
    <div style={{ textAlign: 'center', padding: '1em' }}>
      <p>Loading...</p>
      <CircularProgress size={2} />
    </div>
  );
}
