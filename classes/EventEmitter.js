class EventEmitter {
  constructor() {
    this.subs = {};
  }

  on(name, fn) {
    if(!this.subs[name]) this.subs[name] = [];

    this.subs[name].push(fn);
  }
  
  off(name, fn) {
    if(!this.subs[name]) return;

    const index = this.subs[name].indexOf(fn);

    if(index !== -1) this.subs[name].splice(index, 1);
  }

  emit(name, data) {
    if(!this.subs[name]) return;

    for(let i in this.subs[name]) {
      this.subs[name][i](data);
    }
  }
}

const events = new EventEmitter();

module.exports = events;
