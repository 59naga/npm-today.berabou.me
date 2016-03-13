// Dependencies
import { jsdom } from 'jsdom';

// see:
// https://github.com/airbnb/enzyme/blob/v2.1.0/docs/guides/jsdom.md#using-enzyme-with-jsdom
const exposedProperties = ['window', 'navigator', 'document'];
global.document = jsdom('');
global.window = document.defaultView;

// https://github.com/rofrischmann/inline-style-prefixer/issues/60#issuecomment-185734503
if (typeof console.debug === 'undefined') {
  console.debug = ()=>{
    // ignore "Download the React DevTools for a better development experience"
  };
}
global.navigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36'
};
