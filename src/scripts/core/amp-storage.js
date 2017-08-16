import {
  UTM,
  QUERY_STRING,
  DEFAULT_UTM_CAMPAIGN_ID,
  MEDIUM_WHITELIST,
  SOURCE_WHITELIST,
  WHITELISTED_UTM,
  AMP_STORE_PREFIX
} from './scripts/constants';

export class AmpStorage {
  constructor() {
    _.assign(this, {
      localStorageEnabled: _.has(window, 'localStorage'),
      sessionStorageEnabled: _.has(window, 'sessionStorage'),
      cookiesEnabled: navigator.cookieEnabled
    });
    try {
      localStorage.setItem('test', 'test');
    } catch (error) {
      this.localStorageEnabled = false;
    }
    try {
      sessionStorage.setItem('test', 'test');
    } catch (error) {
      this.sessionStorageEnabled = false;
    }
    this._initCookie();
    this.localStorageEnabled && localStorage.getItem(UTM.params);
    this.sessionStorageEnabled && sessionStorage.getItem(UTM.params);
    this.useQueryParams = !(this.localStorageEnabled || this.sessionStorageEnabled || this.cookiesEnabled);
    this.sync = _.debounce(this._sync.bind(this), 500);
    window.addEventListener('beforeunload', this._sync.bind(this));
  }

  _initCookie() {
    this.inMemoryCache = this._getCookie(true);
    if (!this.inMemoryCache || _.isString(this.inMemoryCache)) {
      _.set(this, 'inMemoryCache', {[UTM.id]: _.get(this.getQueryParams(), UTM.campaign, DEFAULT_UTM_CAMPAIGN_ID)});
      this._sync();
    }
    return _.clone(this.inMemoryCache);
  }

  setQueryParams(params) {
    const oldParams = this.getQueryParams();
    const newParams = _.assignWith(oldParams, params, (origin, src, key) => {
      switch (key) {
        case UTM.id:
          oldParams[UTM.campaign] = src;
          return null;
        case UTM.campaign:
          return origin;
        default:
          return src || origin;
      }
    });
    this._applyQueryParams(newParams);
    return newParams;
  }

  set(key, info) {
    const cache = _.set(this.inMemoryCache, key, info);
    this.sync();
    return _.cloneDeep(cache);
  }

  unset(key) {
    const cache = _.unset(this.inMemoryCache, key);
    this.sync();
    return _.cloneDeep(cache);
  }

  get(key, def) {
    return _.get(this.inMemoryCache, key, def);
  }

  clear() {
    const client = this.get(UTM.client);
    this.localStorageEnabled && localStorage.clear();
    this.sessionStorageEnabled && sessionStorage.clear();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() - 1);
    document.cookie = `${document.cookie};${UTM.params}=;path=/;expires=${expires.toUTCString()}`;
    this.inMemoryCache = {};
    this._applyQueryParams({}, client);
    this.sync();
  }

  getQueryParams() {
    return m.parseQueryString(location.search);
  }

  generateCookie(defaultMedium = 'other', ampId, campaignId) {
    defaultMedium = this.get(UTM.medium, defaultMedium);
    const queryParams = m.parseQueryString(QUERY_STRING);
    let medium = queryParams[UTM.medium] || this.get(UTM.medium);
    medium = _.includes(MEDIUM_WHITELIST, medium) ? medium : defaultMedium;
    let source = queryParams[UTM.source];

    !_.includes(SOURCE_WHITELIST, source) && (source = 'ampush');
    const newQueryParams = {
      [UTM.source]: source,
      [UTM.medium]: medium,
      [UTM.id]: ampId,
      [UTM.campaign]: campaignId
    };
    this.setQueryParams(newQueryParams);
    _.each(newQueryParams, (val, key) => this.set(key, val));
    this._sync();
    return _.clone(this.inMemoryCache);
  }
  _convertCookie(cookie, init) {
    try {
      cookie = JSON.parse(cookie);
    } catch (err) {
      cookie = init ? null : this._initCookie();
    }
    return cookie;
  }

  _getCookie(initializingCookie) {
    const cookie = this.getQueryParams();
    !cookie && _.assign(cookie, this._getCookieObject(document.cookie)[UTM.params]);
    this.sessionStorageEnabled && _.assign(cookie, this._convertCookie(sessionStorage.getItem(UTM.params), initializingCookie));
    this.localStorageEnabled && _.assign(cookie, this._convertCookie(localStorage.getItem(UTM.params), initializingCookie));
    return cookie;
  }

  _getCookieObject(cookie) {
    return _.chain(cookie.split(';'))
    .map(val => _.trim(val).split('='))
    .keyBy(0)
    .mapValues(([, val]) => val)
    .value();
  }

  _sync() {
    const queryCookie = _.transform(this.inMemoryCache, (result, value, key) =>  {
      if (_.includes(key, AMP_STORE_PREFIX) && value) {
        result[key] = value;
      }
    });
    this.setQueryParams(queryCookie);
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    const stringCookie = JSON.stringify(this.inMemoryCache);
    this.localStorageEnabled && localStorage.setItem(UTM.params, stringCookie);
    this.sessionStorageEnabled && sessionStorage.setItem(UTM.params, stringCookie);
    this.cookiesEnabled && (document.cookie = `${UTM.params}=${stringCookie};path=/;max-age=31536000;expires=${expires.toUTCString()}`);
  }

  _getInitialQuery() {
    return _.transform(this.getQueryParams(), (store, param, key) => {
      param && WHITELISTED_UTM[key] && _.set(store, key, param);
    }, {});
  }

  static clickFn(onClick, href, e) {
    e.preventDefault();
    let prevented = false;
    e.preventDefault = () => {prevented = true;};
    onClick(e);
    !prevented && (window.location = href);
  }

  _applyQueryParams(queryObj, client) {
    queryObj = queryObj || this._getInitialQuery();
    if (_.isString(queryObj)) {
      queryObj = m.parseQueryString(queryObj);
    }
    client = client || this.get(UTM.client);
    const medium = queryObj[UTM.medium] || this.get(UTM.meduim);
    const stateInfo = {medium, client};
    let url = window.location.origin;
    (process.env.NODE_ENV !== 'production' || window.__HARDURL__)
      && (url += window.location.pathname);
    window.history.replaceState(stateInfo, window.document.title, `${url}?${m.buildQueryString(queryObj).replace('&utm_id', '')}`);

    _.each(document.body.getElementsByTagName('a'), tag => {
      const oldQuery = m.parseQueryString(tag.search);
      const newQuery = _.assign(oldQuery, queryObj);
      if (tag.href && tag.protocol.match('http')) {
        tag.search = `?${m.buildQueryString(newQuery)}`;
        if (tag.onclick && !tag.__onClick) {
          tag.onclick = _.partial(AmpStorage.clickFn, tag.onclick.bind(tag), tag.href);
        }
      }
    });
  }
}

export default new AmpStorage();
