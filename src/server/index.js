import express from 'express';
import cors from 'cors';
import compression from 'compression';
import npmToday from './middleware';
import path from 'path';

// Environment
const port = process.env.PORT || 59798;
const publicDir = path.join(process.cwd(), 'public');

// Routes
const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(compression());
app.get('/downloads', npmToday({ cwd: publicDir }));
app.use(express.static(publicDir));

// Boot
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
