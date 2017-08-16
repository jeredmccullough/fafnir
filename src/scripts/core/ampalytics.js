import ampStore from './amp-storage';
import {deserialize} from './scripts/helper-functions';

import {
  AMP_ID_REGEX,
  API_URL,
  DEFAULT_UTM_CAMPAIGN_ID,
  HTML_METHODS,
  UTM
} from './scripts/constants';

export default class Ampalytics {
  constructor(partner) {
    _.assign(this, {
      ampStore,
      partner,
      plugins: {},
      ampId: DEFAULT_UTM_CAMPAIGN_ID
    });

    this.generateAmpId().then(({ampId, campaignId}) => {
      ampStore.generateCookie(this.partner.medium, ampId, campaignId);
      this.activate();
    });
    this.track = this.track.bind(this);
  }

  activate() {
    if (!this.active) {
      const pluginObj = _.assign({amp: true}, _.get(this, 'partner.plugins', {}));
      _.each(pluginObj, (id, name) => _.set(this, ['plugins', name], Ampalytics.plugins[name].init(id)));
      this.track('init', {queryParams: this.queryParams});
      this.active = true;
    }
  }

  generateAmpId() {
    let campaignId = _.get(ampStore.getQueryParams(), UTM.campaign);
    !campaignId && (campaignId = ampStore.get(UTM.campaign));
    !campaignId && (campaignId = DEFAULT_UTM_CAMPAIGN_ID);
    campaignId = campaignId.toString();

    if (campaignId.match(AMP_ID_REGEX)) {
      this.ampId = campaignId;
      return new Promise(res => res({ampId: this.ampId}));
    }

    const handleResponse = ({ampId}) => {
      this.ampId = ampId;
      return {ampId, campaignId};
    };

    return m.request(API_URL, {
      data: {id: campaignId},
      method: HTML_METHODS.post,
      deserialize
    })
      .then(({amp_id: ampId = this.ampId}) => ({ampId}), err => err)
      .then(handleResponse, handleResponse);
  }

  track(trackEvent, trackInfo = {}) {
    trackEvent = _.castArray(trackEvent);
    trackInfo = _.assign(_.clone(this.partner), trackInfo);
    trackInfo.variantId = window.__VARIANT_ID__;
    trackInfo.template = window.__TEMPLATE__;
    _.each(trackEvent, event => _.each(this.plugins, plugin => {
      const temp = _.assign(_.clone(trackInfo), {
        variantInfo: _.get(trackInfo.events, [plugin.name, event, trackInfo.variantId]),
        templateInfo: _.get(trackInfo.events, [plugin.name, event, trackInfo.template])
      });
      plugin.track(event, temp);
    }));
  }
}

Ampalytics.Plugin = class Plugin {
  constructor(config) {
    this.events = {};
    _.assign(this, config);
    _.set(Ampalytics, ['plugins', config.name], this);
  }

  init(id) {
    this.id = id;
    _.invoke(this, 'preInit');
    if (this.url)  {
      this.url = _.template(this.url)(this);
      $script(this.url, this.name, () => {
        this.tracker = window[this.key];
        _.invoke(this, 'postInit', {});
      });
    }
    return this;
  }

  track($event, info = {}) {
    this.url ? $script.ready(this.name, () => _.invoke(this, ['events', $event], info)) : _.invoke(this, ['events', $event], info);
  }
};
