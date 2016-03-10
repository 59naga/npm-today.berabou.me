import Bluebird from 'bluebird';
import express from 'express';
import path from 'path';
import fsOrigin from 'fs';
import zlibOrigin from 'zlib';
import * as npmCount from 'npm-count';

const fs = Bluebird.promisifyAll(fsOrigin);
const zlib = Bluebird.promisifyAll(zlibOrigin);

/**
* @function build
* @param {string} period - pass to npmCount.fetchTrending
* @param {object} [options]
* @param {object} [options.compress=true]
* @param {object} [options.max=500]
* @return {promise<string>} ranking
*/
export const buildCache = {};
export const build = (period, options = {}) => {
  const opts = Object.assign({
    compress: true,
    max: 500,
  }, options);

  // should be single run
  if (buildCache[period]) {
    return buildCache[period];
  }

  buildCache[period] = npmCount.fetchTrending(period)
  .then((trending) => {
    // sort by downloads desc, name asc
    trending.sort((a, b) => {
      if (a.downloads > b.downloads) {
        return -1;
      }
      if (a.downloads < b.downloads) {
        return 1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return 1;
      }

      return 0;
    });

    const ranking = trending.slice(0, opts.max);
    if (opts.compress) {
      return zlib.gzipAsync(JSON.stringify(ranking));
    }
    return JSON.stringify(ranking);
  });

  return buildCache[period];
};

/**
* create npm-today middleware
*
* @function npmToday
* @param {object} [options]
* @param {object} [options.cwd] - generate json base path
* @return {express.Router}
*/
export default (options = {}) => {
  const opts = Object.assign({
    cwd: process.cwd(),
    compress: true,
  }, options);
  const middleware = express.Router();

  /**
  * asynchronously send file
  *
  * @private sendFile
  * @param {httpResponse} res
  * @param {string} fileName
  * @return {promise} - fulfill is file sended, reject is not exists
  */
  const sendFile = (res, fileName) => (
    fs.statAsync(fileName)
    .then(() => {
      if (opts.compress) {
        res.set('Content-Encoding', 'gzip');
      }
      res.set('Content-Type', 'application/json');
      res.sendFile(fileName);
    })
  );

  middleware.get('/', (req, res) => {
    npmCount.fetchLastDay()
    .then((lastday) => {
      res.redirect(`${req.originalUrl}/${lastday}`);
    });
  });
  middleware.get('/last-day', (req, res) => {
    npmCount.fetchLastDay()
    .then((lastday) => {
      res.end(lastday);
    });
  });
  middleware.get('/:period(\\d{4}-\\d{2}-\\d{2})', (req, res) => {
    const { period } = req.params;
    const ext = opts.compress ? '.json.gz' : '.json';
    const fileName = path.join(opts.cwd, `${period}${ext}`);

    sendFile(res, fileName)
    .catch(() => (
      build(period, opts)
      .then((file) => fs.writeFileAsync(fileName, file))
      .then(() => sendFile(res, fileName))
      .catch(() => {
        // fix: ENOENT: no such file or directory, stat `${period}.json`
        delete buildCache[period];
        res.redirect(req.originalUrl);
      })
    ));
  });

  return middleware;
};
