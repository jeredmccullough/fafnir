/* eslint-disable camelcase */
import ampStore from 'amp-storage';
import Ampalytics from 'ampalytics';
let tracker;
const plugin = new Ampalytics.Plugin({
  name: 'ampush',
  url: `//files.ampush.io/js/tracker.js?${Date.now()}`,
  key: 'ampt',
  preInit() {
    window.ampt = {};
  },
  postInit() {
    tracker = window.ampt;
    m.request({
      method: 'GET',
      url: 'https://tracker.ampush.io/track?debug=1'
    }).then(({data: [response]}) => {
      const userInfo = JSON.parse(response);
      ampStore.set('user', userInfo);
    });
    tracker.init(...plugin.id);
  },
  events: {}
});

export default plugin;
