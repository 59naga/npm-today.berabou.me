[npm-today.berabou.me](http://npm-today.berabou.me/)
---

![2016-03-12_15_42_27.png](https://qiita-image-store.s3.amazonaws.com/0/28576/bc58eb20-c009-8ca8-985c-08468520169f.png)

API URL Format
---
* `/downloads` -> npm's lastday published download-counts (`.json.gz`)
* `/downloads/last-day` -> `npm's lastday` (`.txt`)
* `/downloads/YYYY-MM-DD` -> specify date published package download-counts (`.json.gz`)

Development
---
Requirement global
* NodeJS v5.7.0
* Npm v3.7.1
* Babel-cli v6.5.1 (babel-core v6.5.2)

```bash
git clone https://github.com/59naga/npm-today.berabou.me
cd npm-today.berabou.me
npm install

# client only(using http://npm-today.berabou.me/downloads)
npm run dev

# boot hosting server
npm run postinstall
npm start
#  _      ____  _          _____ ____  ____  ____ ___  _
# / \  /|/  __\/ \__/|    /__ __Y  _ \/  _ \/  _ \\  \//
# | |\ |||  \/|| |\/||_____ / \ | / \|| | \|| / \| \  /
# | | \|||  __/| |  ||\____\| | | \_/|| |_/|| |-|| / /
# \_/  \|\_/   \_/  \|      \_/ \____/\____/\_/ \|/_/
#
#              http://localhost:59798

```

TODO
---
- [ ] TEST

License
---
[MIT](http://59naga.mit-license.org/)
