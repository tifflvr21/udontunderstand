const PREFIX = '_ins';

class Store {
  constructor() {
    this.store = this.getLsSaved();
  }

  set(key, value) {
    key = `${PREFIX}_${key}`;

    this.store[key] = value;
    localStorage.setItem(key, typeof value == 'object' ? JSON.stringify(value) : value);

    return value;
  }

  getLsSaved() {
    let res = {};

    for(let i in localStorage) {
      if(typeof localStorage[i] !== 'function' && i !== 'length') {
        try {
          res[i] = JSON.parse(localStorage[i]);
        } catch(e) {
          res[i] = localStorage[i];
        }
      }
    }

    return res;
  }

  get(key) {
    key = `${PREFIX}_${key}`;

    return this.store[key];
  }

  delete(key) {
    key = `${PREFIX}_${key}`;

    localStorage.removeItem(key);
    delete this.store[key];
  }
}

// todo: might have to make it a global var just like io if things get fucky
const store = new Store();

module.exports = store;