import Bluebird from 'bluebird';
import fetch from 'node-fetch';
import path from 'path';
import fsOrigin from 'fs';
import express from 'express';

const fs = Bluebird.promisifyAll(fsOrigin);

/**
* return lastday of api.npmjs
*
* @function fetchStats
* @return {promise<string>} lastday
*/
export const fetchLastDay = () => (
  fetch('https://api.npmjs.org/downloads/point/last-day/',{compress:false})
  .then((response) => response.json())
  .then((data) => data.start)
);

/**
* return stat json list
*
* @function fetchStats
* @param {array<packageInfo>} pkgs -
* @param {string} period - See https://github.com/npm/download-counts#point-values
* @return {array<promise>} stats
*/
export const fetchStats = (pkgs, period) => (
  Bluebird.all(pkgs.map((pkg) => {
    const stat = Object.assign({
      downloads: 0,
      downloadsURL: `https://api.npmjs.org/downloads/point/${period}/${pkg.name}`,
    }, pkg);

    return fetch(stat.downloadsURL)
    .then((response) => response.json())
    .then((response) => {
      if (response.downloads) {// or has response.error
        stat.downloads = response.downloads;
      }

      return stat;
    });
  }))
);

/**
* TODO: simultaneously issuing more than 1000 of the request
*
* @function downloadStats
* @param {string} fileName - generate json filename
* @param {string} period - pass to fetchStats@period
* @param {object} [options] -
* @param {object} [options.cwd] -
* @param {object} [options.removeYesterday] - remove yesterday data using downloadStatsCache
* @return {promise<undefined>}
*/
export let downloadStatsCache = {};
export const downloadStatsURL = 'https://registry.npmjs.org/-/all/static/today.json';
export const downloadStats = (fileName, period, options) => {
  const currentCache = Object.keys(downloadStatsCache)[0];
  if (currentCache !== period) {
    downloadStatsCache = {};

    if (options && options.removeYesterday) {
      const yesterday = path.join(options.cwd, `${period}.json`);
      try {
        fs.unlinkSync(yesterday);
      } catch (e) {
        // ignore
      }
    }
  }

  // should be single run
  if (downloadStatsCache[period]) {
    return downloadStatsCache[period];
  }

  downloadStatsCache[period] = fetch(downloadStatsURL)
  .then((response) => response.json())
  .then((pkgs) => fetchStats(pkgs, period))
  .then((stats) => {
    stats.sort((a, b) => {
      switch (true) {
        case a.downloads > b.downloads: return -1;
        case a.downloads < b.downloads: return 1;
        default:
          switch (true) {
            case a.name > b.name: return -1;
            case a.name < b.name: return 1;
            default: return 0;
          }
      }
    });

    const fileData = stats.filter((pkg) => pkg.downloads > 0);

    return fs.writeFileAsync(fileName, JSON.stringify(fileData));
  });

  return downloadStatsCache[period];
};

/**
* asynchronously send file
*
* @function sendFile
* @param {httpResponse} res
* @param {string} fileName
* @return {promise} - fulfill is file sended, reject is not exists
*/
export const sendFile = (res, fileName) => (
  fs.statAsync(fileName)
  .then(() => {
    res.sendFile(fileName);
  })
);

/**
* create npm-today middleware
*
* @function npmToday
* @param {object} [options]
* @param {object} [options.cwd] - generate json base path
* @param {object} [options.removeYesterday] - remove json yesterday data
* @return {express.Router}
*/
export default (options = {}) => {
  const opts = Object.assign({
    cwd: process.cwd(),
    removeYesterday: true,
  }, options);
  const middleware = express.Router();

  middleware.use((req, res) => {
    fetchLastDay()
    .then((period) => {
      const fileName = path.join(opts.cwd, `${period}.json`);

      sendFile(res, fileName)
      .catch(() => (
        downloadStats(fileName, period, opts)
        .then(() => sendFile(res, fileName))
        .catch(() => {
          // fix: ENOENT: no such file or directory, stat `${period}.json`
          downloadStatsCache = {};
          res.redirect(req.url);
        })
      ));
    })
    .catch((error) => {
      res.status(500).end(error.message);
    });
  });

  return middleware;
};
