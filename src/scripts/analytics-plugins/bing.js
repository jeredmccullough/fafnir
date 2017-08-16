import Ampalytics from 'ampalytics';
let tracker;

const plugin = new Ampalytics.Plugin({
  name: 'bing',
  url: '//bat.bing.com/bat.js',
  key: 'UET',

  postInit() {
    tracker = window.UET;
    new tracker(plugin.id).push('pageLoad');
  }
});

export default plugin;
