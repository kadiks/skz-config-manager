//UMD template based on this: https://github.com/umdjs/umd/blob/master/returnExportsGlobal.js
(function(root, factory) {
  if (typeof(define) === 'function' && define.amd) {
    define([], function() {
      return (root.skzConfigManager = factory());
    });
  } else if (typeof(exports) === 'object') {
    module.exports = factory();
  } else {
    root.skzConfigManager = factory(root.b);
  }
}(this, function(b) {
  /**
   * @class SKZ.ConfigManager
   *
   * @param {Object} params
   * @param {Boolean} [params.autoLoad=true] Load the file and the arguments at instatiation
   */

  function ConfigManager(params) {
    var
      o = params || {},
      autoLoad = typeof(o.autoLoad) === 'boolean' ? o.autoLoad : true,
      callback = typeof(o.callback) === 'function' ? o.callback : null;

    if (callback === null) {
      return;
    }

    if (autoLoad) {
      this.initialize({
        callback: callback
      });
    }
  };

  /**
   * @property {String} [_configLocation='config.json']
   * @private
   */
  ConfigManager.prototype._configLocation = 'config.json';

  /**
   * @property {String} [_fileContent=null]
   * @private
   */
  ConfigManager.prototype._fileContent = null;

  /**
   * @property {Object} [_cfgArg=null] config object from the arguments
   * @private
   */
  ConfigManager.prototype._cfgArg = null;

  /**
   * @property {Object} [_cfgFile=null] config object from the file
   * @private
   */
  ConfigManager.prototype._cfgFile = null;

  /**
   * Get the key of the configuration object
   *
   * @param {Object} params
   * @param {String} params.key Key of the value to fetch
   *
   */
  ConfigManager.prototype.get = function(params) {
    var
      o = params || {},
      key = o.key || null,
      valArg = null,
      valFile = null;

    if (key === null) {
      return;
    }

    valArg = this._getDeepValue({
      key: key,
      configObject: this._cfgArg
    });
    valFile = this._getDeepValue({
      key: key,
      configObject: this._cfgFile
    });
    if (typeof(valArg) === 'undefined') {
      return valFile;
    }

    return valArg;
  };

  /**
   * Get the configuration location file
   *
   * @return {String} location
   */
  ConfigManager.prototype.getConfigLocation = function(params) {
    return this._configLocation;
  };

  /**
   * Initialize the configuration
   */
  ConfigManager.prototype.initialize = function(params) {
    var
      o = params || {},
      callback = typeof(o.callback) === 'function' ? o.callback : null,
      self = this;
    this._loadFile({
      callback: function(err, data) {
        if (err) {
          callback(err);
        }
        self._loadArgs({
          args: process.argv
        });
        callback(null);
      }
    });
  };

  /**
   * Set the configuration location file
   *
   * @param {Object} params
   * @param {String} params.location
   */
  ConfigManager.prototype.setConfigLocation = function(params) {
    var o = params || {},
      location = o.location || null;

    if (location === null) {
      return;
    }
    this._configLocation = location;
  };
  /**
   * Clean the arguments
   *
   * @param {Object} params
   * @param {Array} params.args
   *
   * @return {Array} The valid arguments
   */
  ConfigManager.prototype._cleanArgs = function(params) {
    var
      o = params || {},
      args = o.args || [],
      cleanedArgs = [],
      pattern = new RegExp('=', 'i');

    args.forEach(function(val, index, array) {
      if (val.match(pattern)) {
        cleanedArgs.push(val);
      }
    });
    return cleanedArgs;
  };

  /**
   * Create a deep object
   *
   * @param {Object} params
   * @param {String} params.key
   * @param {String} params.val
   * @param {Object} params.configObject
   *
   * @return {Array} The valid arguments
   */
  ConfigManager.prototype._createDeepObject = function(params) {
    var
      o = params || {},
      configObject = o.configObject || null,
      obj = configObject,
      key = o.key || null,
      val = o.val || null,
      splittedKey = null,
      splittedKeyLength = 0;

    if (configObject === null) {
      return;
    }
    if (key === null) {
      return configObject;
    }

    splittedKey = key.split('.');
    splittedKeyLength = splittedKey.length - 1;

    for (var i = 0; i < splittedKeyLength; i++) {
      if (obj[splittedKey[i]] === null || typeof(obj[splittedKey[i]]) !== 'object') {
        obj[splittedKey[i]] = {};
      }
      obj = obj[splittedKey[i]];
    }

    if (!isNaN(parseInt(val, 10))) {
      val = parseInt(val, 10);
    }

    obj[splittedKey[splittedKeyLength]] = val;

    return configObject;
  };

  /**
   * Get the value of the object from a string path
   *
   * @param {Object} params
   * @param {String} params.key
   * @param {Object} params.configObject
   *
   * http://stackoverflow.com/a/20240290
   */

  ConfigManager.prototype._getDeepValue = function(params) {
    var
      o = params || {},
      key = o.key || null,
      configObject = o.configObject || null,
      splittedKey = null;

    if (key === null) {
      return;
    }

    if (configObject === null) {
      return;
    }

    splittedKey = key.split('.');
    while (splittedKey.length) {
      var currentNode = splittedKey.shift();
      if (currentNode in configObject) {
        configObject = configObject[currentNode];
      } else {
        return;
      }
    }
    return configObject;
  };

  /**
   * Load the config file
   * @private
   *
   * @param {Object} params
   * @param {Function} params.callback
   */
  ConfigManager.prototype._loadFile = function(params) {
    var fs = require('fs'),
      o = params || {},
      callback = typeof(o.callback) === 'function' ? o.callback : null,
      self = this;
    if (callback === null) {
      return;
    }
    fs.readFile(this._configLocation, {
      encoding: 'utf8'
    }, function(err, data) {
      if (err) {
        callback(err);
      }
      self._fileContent = data;
      self._cfgFile = JSON.parse(data);
      callback(null, data);
    });
  };

  /**
   * Load the arguments
   * @private
   */
  ConfigManager.prototype._loadArgs = function(params) {
    var
      o = params || {},
      args = o.args || null,
      cleanedArgs = null;
    if (args === null) {
      return;
    }
    cleanedArgs = this._cleanArgs({
      args: args
    });

    this._cfgArg = this._turnArgsToCfg({
      args: cleanedArgs
    });
  };

  /**
   * Turn the arguments to a config object
   */
  ConfigManager.prototype._turnArgsToCfg = function(params) {
    var
      o = params || {},
      args = o.args || [],
      argsCfg = {},
      currentArgKey = null,
      currentArgVal = null,
      currentArg = null,
      self = this;

    args.forEach(function(arg) {
      currentArg = arg;
      currentArgVal = arg.split('=')[1];
      currentArgKey = arg.split('=')[0];
      self._createDeepObject({
        configObject: argsCfg,
        key: currentArgKey,
        val: currentArgVal
      });
    });
    return argsCfg;
  };

  return ConfigManager;

}));
