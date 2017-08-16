import Ampalytics from 'ampalytics';
let tracker;

const plugin = new Ampalytics.Plugin({
  name: 'taboola',
  url: 'https://cdn.taboola.com/libtrc/${id}/tfa.js',
  key: '_tfa',
  preInit() {
    window._tfa = window._tfa || [];
  },
  postInit() {
    tracker =  window._tfa;
    tracker.push({
      notify: 'mark',
      type: 'site_visitor'
    });
  },
  events: {}
});

export default plugin;
