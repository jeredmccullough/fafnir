import Ampalytics from 'ampalytics';
let tracker;

const plugin = new Ampalytics.Plugin({
  name: 'facebook',
  url: '//connect.facebook.net/en_US/fbevents.js',
  key: 'fbq',

  preInit() {
    const fbq = function() {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = window._fbq = fbq;
  },

  postInit() {
    tracker = window.fbq;
    _(plugin.id)
    .castArray()
    .each(id => {
      tracker('init', id);
      tracker('track', 'PageView');
    });
  }
});

export default plugin;
