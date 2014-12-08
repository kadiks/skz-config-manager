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
      autoLoad = typeof(o.autoLoad) === 'boolean' ? o.autoLoad : true;

    if (autoLoad) {
      this.initialize();
    }
  };

  /**
   * @property {String} [_configLocation='config.json']
   * @private
   */
  ConfigManager.prototype._configLocation = 'config.json';

  /**
   * @property {Object} [_cfg=null]
   * @private
   */
  ConfigManager.prototype._cfg = null;

  /**
   * Get the key of the configuration object
   *
   * @param {Object} params
   * @param {String} params.key Key of the value to fetch
   *
   */
  ConfigManager.prototype.get = function(params) {

  };

  /**
   * Initialize the configuration
   */
  ConfigManager.prototype.initialize = function(params) {
    this._loadFile();
    this._loadArgs(process.argv);
  };

  /**
   * Load the config file
   * @private
   */
  ConfigManager.prototype._loadFile = function(params) {

  };

  /**
   * Load the arguments
   * @private
   */
  ConfigManager.prototype._loadArgs = function(args) {

};


  return ConfigManager;

}));
