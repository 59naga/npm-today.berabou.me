import React from 'react';
import objectAssign from 'object-assign';

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
* TODO: なんか書く
*
* @function createResult
* @param {array<pkg>} packages
* @param {object} [options]
* @param {string} [options.query='']
* @return {array<MaterialUI:ListItem>} listItems
*/
export function createResult(packages, options = {}) {
  const opts = objectAssign({
    query: '',
  }, options);

  let total = 0;
  let count = 0;
  const listItems = [];
  packages.forEach((pkg, i) => {
    total += pkg.downloads;
    if (pkg.downloads <= 0) {
      return undefined;
    }
    if (opts.query) {
      const matchName = pkg.name.match(opts.query) !== null;
      const matchDescription = (pkg.description || '').match(opts.query) !== null;
      const matchKeyword = (pkg.keywords || []).join(', ').match(opts.query) !== null;
      const matchMaintaner = getMaintainers(pkg).match(opts.query) !== null;
      const unMatch = (matchName || matchDescription || matchKeyword || matchMaintaner) === false;
      if (unMatch) {
        return undefined;
      }
    }
    count++;

    listItems.push(
      <ListItem
        key={pkg.name}
        value={i}
        primaryText={pkg.name}
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
