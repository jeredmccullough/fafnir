import Ampalytics from 'ampalytics';
let tracker;
const preloadArgs = [];
const preloadFn = (...args) => preloadArgs.push(args);

const plugin = new Ampalytics.Plugin({
  name: 'google',
  url: '//www.googleadservices.com/pagead/conversion_async.js',
  key: 'google_trackConversion',
  preInit() {
    // eslint-disable-next-line camelcase
    window[plugin.key] = preloadFn;
  },
  postInit() {
    preloadFn(plugin.id);
    let backoff = 0;
    let count = 0;
    const interval = setInterval(() => {
      count ++;
      backoff = Math.pow(2, count) - 1;
      if (window[plugin.key] !== preloadFn) {
        clearInterval(interval);
        tracker = window[plugin.key];
        _.each(preloadArgs, val => tracker(...val));
      }
    }, backoff);
  }
});

export default plugin;
