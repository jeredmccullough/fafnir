import Ampalytics from 'ampalytics';
let tracker;

const plugin = new Ampalytics.Plugin({
  name: 'outbrain',
  url: '//amplify.outbrain.com/cp/obtp.js',
  key: 'obApi',
  preInit() {
    tracker = window[plugin.key] = function() {
      tracker.dispatch ? tracker.dispatch.apply(tracker, arguments) : tracker.queue.push(arguments);
    };
    tracker.version = '1.0';
    tracker.loaded = true;
    tracker.marketerId = this.id;
    tracker.queue = [];

  },
  postInit() {
    tracker = this.tracker = window[plugin.key];
    tracker('track', 'PAGE_VIEW');
  }
});

export default plugin;
