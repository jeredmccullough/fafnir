import Ampalytics from 'ampalytics';
let tracker;

const plugin = new Ampalytics.Plugin({
  name: 'yahoo',
  url: 'https://s.yimg.com/wi/ytc.js',
  key: 'YAHOO',
  preInit() {
    window._tfa = window._tfa || [];
  },
  postInit() {
    const yahooFn = _.get(window, 'YAHOO.ywa.I13N.fireBeacon');
    tracker = [];
    tracker.push = (...args) => yahooFn(args);
    tracker.push(this.id);
  }
});

export default plugin;
