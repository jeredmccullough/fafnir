import ampStore from 'amp-storage';
export default class Api {
  constructor({url, type, methods, cache, cacheId, defaultPath}) {
    _.assign(this, {url, type, methods, cache, cacheId, defaultPath});
  }

  get(data, cache = this.cache, path = this.defaultPath) {
    if (_.isString(cache)) {
      path = cache;
      cache = this.cache;
    }

    const identifier = JSON.stringify(data);
    const cachedResponse = ampStore.get([this.cacheId, identifier]);
    if (cachedResponse && cache) {
      return new Promise(res => res(cachedResponse));
    }
    if (this.methods.get) {
      const requestObj = {url: `${this.url}${path}`, method: 'GET'};
      let request;
      switch (this.type) {
        case 'jsonp':
          requestObj.data = data;
          request = m.jsonp(requestObj);
          break;
        default:
          requestObj.url += `?${m.buildQueryString(data, cache = this.cache)}`;
          request =  m.request(requestObj);
      }
      return request.then(response => {
        cache && ampStore.set([this.cacheId, identifier], response);
        return response;
      });
    }
    return new Promise((res, rej) => rej({error: 'METHOD NOT ALLOWED'}));
  }

  post(data, cache = this.cache) {
    if (this.methods.post) {
      const request = {url: this.url, method: 'POST', data};
      switch (this.type) {
        case 'jsonp':
          return m.jsonp(request);
        default:
          return m.request(request);
      }
    }
    return new Promise((res, rej) => rej({error: 'METHOD NOT ALLOWED'}));

  }

  put(data, cache = this.cache) {
    if (this.methods.put) {
      const request = {url: this.url, method: 'PUT', data};
      switch (this.type) {
        case 'jsonp':
          return m.jsonp(request);
        default:
          return m.request(request);
      }
    }
    return new Promise((res, rej) => rej({error: 'METHOD NOT ALLOWED'}));

  }

  delete(data, cache = this.cache) {
    if (this.methods.get) {
      const request = {url: this.url, method: 'DELETE', data};
      switch (this.type) {
        case 'jsonp':
          return m.jsonp(request);
        default:
          return m.request(request);
      }
    }
    return new Promise((res, rej) => rej({error: 'METHOD NOT ALLOWED'}));

  }
}
