window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey = "bestScore";
  this.gameStateKey = "gameState";
  this.lastGameStateKey = "lastGameState";
  this.rewindsLeftKey = "rewindsLeft";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

LocalStorageManager.prototype.getRewindsLeft = function () {
  return this.storage.getItem(this.rewindsLeftKey) || 1;
};

LocalStorageManager.prototype.setRewindsLeft = function (count) {
  this.storage.setItem(this.rewindsLeftKey, count);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  if(this.getGameState()!=null) {
  	this.setLastGameState(this.getGameState());
  }
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
  this.storage.removeItem(this.lastGameStateKey);
  this.storage.removeItem(this.rewindsLeftKey);
};

LocalStorageManager.prototype.getLastGameState = function () {
  var lastStateJSON = this.storage.getItem(this.lastGameStateKey);
  return lastStateJSON ? JSON.parse(lastStateJSON) : null;
};

LocalStorageManager.prototype.setLastGameState = function (lastGameState) {
  this.storage.setItem(this.lastGameStateKey, JSON.stringify(lastGameState));
};

LocalStorageManager.prototype.rewindGameState = function () {
  if(this.getLastGameState()!=null) {
	this.setRewindsLeft(0);
  	this.setGameState(this.getLastGameState());
  }
};