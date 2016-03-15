import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../client/routes';
import Promise from 'bluebird';
import fsOrigin from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { createSession } from 'redux-hermit';
import mkdirp from 'mkdirp';
import paramCase from 'param-case';

// module enhancement
const fs = Promise.promisifyAll(fsOrigin);

// fix http://stackoverflow.com/questions/35481084/react-starter-kit-and-material-ui-useragent-should-be-supplied-in-the-muitheme
if (global.navigator === undefined) {
  global.navigator = { userAgent: 'all' };
}

/**
*
* @module serverSideRenderingMiddleware
* @param {object} [options]
* @param {string} [options.cwd] - cache directory
* @param {string} [options.html] - cache main layout html
* @param {number} [options.expire] - cache expire
* @param {string|regexp} [options.include] - if match, server side rendering
* @param {string|regexp} [options.include] - unless match, server side rendering
*/
export default (options) => (req, res, next) => {
  const opts = Object.assign({
    cwd: path.join(process.cwd(), 'public', 'cache'),
    html: '<div id="container"></div>',
    expire: 60 * 1000, // one min

    // eslint-disable-next-line max-len
    include: /msie\s[6-9]|bot|crawler|baiduspider|80legs|ia_archiver|voyager|curl|wget|yahoo! slurp|mediapartners-google/i,
    exclude: null,
  }, options);

  const ua = req.get('User-Agent');
  if (ua.match(opts.include) === null) {
    return next();
  }
  if (opts.exclude && ua.match(opts.exclude)) {
    return next();
  }

  return match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const cacheName = `${paramCase(req.url)}.html`;
      const cachePath = path.join(opts.cwd, cacheName);

      fs.statAsync(cachePath)
      .then(() => res.sendFile(cachePath))
      .catch(() => (
        createSession(() => {
          renderToStaticMarkup(<RouterContext {...renderProps} />);
        }, { timeout: 5000 })
        .then(() => {
          const $ = cheerio.load(opts.html);
          const innerHTML = renderToStaticMarkup(<RouterContext {...renderProps} />);

          $('#container').html(innerHTML);
          $('*[style]').attr('style', null);

          mkdirp.sync(opts.cwd);

          return fs.writeFileAsync(cachePath, $.html());
        })
        .then(() => res.sendFile(cachePath))
        .then(() => {
          if (!opts.expire) {
            return;
          }

          setTimeout(() => {
            try {
              fs.unlinkSync(cachePath);
            } catch (e) {
              // ignore
            }
          }, opts.expire);
        })
      ));
    } else {
      res.status(404).send('Not found');
    }
  });
};
