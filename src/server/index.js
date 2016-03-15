import express from 'express';
import cors from 'cors';
import compression from 'compression';
import npmToday from './middleware';
import ssr from './ssr';
import path from 'path';
import fs from 'fs';

// Environment
const port = process.env.PORT || 59798;
const publicDir = path.join(process.cwd(), 'public');
const cacheDir = path.join(publicDir, 'cache');
if (process.env.NODE_ENV === 'production') {
  process.env.URL = 'http://npm-today.berabou.me';
} else {
  process.env.URL = `http://localhost:${port}`;
}

// Routes
const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(compression());
app.use(ssr({
  cwd: cacheDir,
  html: fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8'),
}));
app.use('/downloads/', npmToday({ cwd: cacheDir }));
app.use(express.static(publicDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Boot
if (module.parent === null) {
  app.listen(port, () => {
    let banner = String.raw`
       _      ____  _          _____ ____  ____  ____ ___  _
      / \  /|/  __\/ \__/|    /__ __Y  _ \/  _ \/  _ \\  \//
      | |\ |||  \/|| |\/||_____ / \ | / \|| | \|| / \| \  /
      | | \|||  __/| |  ||\____\| | | \_/|| |_/|| |-|| / /
      \_/  \|\_/   \_/  \|      \_/ \____/\____/\_/ \|/_/
    `;
    banner += `
                    http://localhost:${port}
    `;
    process.stdout.write(banner);
  });
}

export default app;
