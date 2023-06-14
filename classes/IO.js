const io = require('socket.io-client');

const store = require('./Store');
const events = require('./EventEmitter');
const config = require('../config');

function isPlainObject(input) {
  return input && !Array.isArray(input) && typeof input === 'object';
}

class IO {
  constructor() {
    this.connected = false;
    this.socket = io(config.url);

    this.socket.on('connect', () => {
      this.connected = true;
      events.emit('io:connected');

      this.emit('handshake', store.get('token'));
    });

    this.socket.on('connect_error', () => {
      this.connected = false;
      events.emit('io:connect_error');
    });

    this.socket.on('handshake_complete', () => {
      const room = store.get('lastJoinedRoom');
      this.construct('chat:joinRoom', room || 0);
    });

    this.socket.on('user', data => this.deconstruct('user', data));
    this.socket.on('chat', data => this.deconstruct('chat', data));
    this.socket.on('generic', data => this.deconstruct('generic', data));
    this.socket.on('roulette', data => this.deconstruct('roulette', data));
    this.socket.on('tf2_jackpot', data => this.deconstruct('tf2_jackpot', data));
    this.socket.on('tf2_coinflip', data => this.deconstruct('tf2_coinflip', data));
    this.socket.on('tf2_mines', data => this.deconstruct('tf2_mines', data));
    this.socket.on('transactions', data => this.deconstruct('transactions', data));

    this.socket.on('jackpot-win', data => events.emit('jackpot-win', data));
    this.socket.on('coinflip-win', data => events.emit('coinflip-win', data));
    this.socket.on('mines-win', data => events.emit('mines-win', data));
  }

  // turns 'event:something' with data 0 into {action: 'something', something: 0}
  construct(e, data) {
    const action = e.split(':');
  
    if(!isPlainObject(data)) {
      const tmp = data;
      data = {};
      data[action[1]] = tmp;
    }

    data.action = action[1];
    data.token = store.get('token');

    // console.log(`Sending a "${e}" event to server with following data`, data);

    this.socket.emit(action[0], data);
  }

  // turns {action: 'something', something: 0} into 'event:something' with data 0
  deconstruct(e, data = {}) {
    const action = data.action;

    if(Object.keys(data).length == 2) {
      if(typeof data[action] !== 'undefined') data = data[action];
    }

    // debug
    // if(`${e}:${action}` !== 'roulette:time') console.log(`Received a "${e}:${action}" event from server with following data`, data);

    events.emit(`${e}:${action}`, data);
  }

  getStatus() {
    return this.connected;
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }
}

module.exports = () => {
  // todo: make sure there is no conflict with exporting "io" in index.js
  if(!window.insolve.io) {
    window.insolve.io = new IO();
  }

  return window.insolve.io;
}