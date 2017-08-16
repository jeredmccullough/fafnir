import Ampalytics from 'ampalytics';
let tracker;
const plugin = new Ampalytics.Plugin({
  name: 'facebooksdk',
  url: '//connect.facebook.net/en_US/sdk.js',
  key: 'FB',
  postInit() {
    tracker = window.FB;
    _.invoke(tracker, 'init', plugin.id);
  }
});

export default plugin;
