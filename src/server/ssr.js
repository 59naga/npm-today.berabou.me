import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../client/routes';
import path from 'path';
import fs from 'fs';
import cheerio from 'cheerio';
import beautify from 'victorica';

const index = {
  html: fs.readFileSync(path.join(process.cwd(), 'public', 'index.html')),
};

export default () => (
  (req, res, next) => {
    if (req.headers['user-agent'].match(/ssr/) === null) {
      return next();
    }

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        const $ = cheerio.load(index.html);
        const innerHTML = renderToString(<RouterContext {...renderProps} />);

        $('#container').html(innerHTML);

        res.status(200).send(beautify($.html()));
      } else {
        res.status(404).send('Not found');
      }
    });
  }
);
