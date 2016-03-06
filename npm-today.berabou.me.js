'use strict';

const Bluebird = require('bluebird');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const fetch = require('node-fetch');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');

const port = process.env.PORT || 59798;

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(compression());

app.get('/', (req, res) => {
  res.redirect('https://github.com/59naga/npm-today.berabou.me#readme');
});

let busy;
app.get('/downloads', (req, res) => {
  fetch('https://api.npmjs.org/downloads/point/last-day/')
  .then((response) => response.json())
  .then((data) => data.start)
  .then((today) => {
    const fileName = path.join(__dirname, `${today}.json`);
    if (busy) {
      return busy
      .then(() => {
        res.sendFile(fileName);
      });
    }

    busy = fs.statAsync(fileName)
    .then(() => {
      res.sendFile(fileName);
    })
    .catch(() => {
      const todayURL = 'https://registry.npmjs.org/-/all/static/today.json';
      fetch(todayURL)
      .then((response) => response.json())
      .then((pkgs) => {
        const stats = {};
        const promises = pkgs.map((pkg, i) => {
          pkg.downloadsURL = `https://api.npmjs.org/downloads/point/${today}/${pkg.name}`;
          pkg.downloads = 0;
          stats[pkg.name] = i;

          return fetch(pkg.downloadsURL).then((response) => response.json());
        });

        return Bluebird.settle(promises)
        .then((inspections) => {
          inspections.forEach((inspection) => {
            if (inspection.isRejected()) {
              return;
            }

            const response = inspection.value();
            if (response.error) {
              return;
            }

            if (pkgs[stats[response.package]]) {
              pkgs[stats[response.package]].downloads = response.downloads;
            }
          });

          pkgs.sort((a, b) => {
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

          return fs.writeFileAsync(fileName, JSON.stringify(pkgs.filter((pkg)=> pkg.downloads)));
        });
      })
      .then(() => {
        res.sendFile(fileName);
      });
    });
  });
});
app.listen(port, () => {
  console.log(`npm-today is available on http://localhost:${port}!`);
});
