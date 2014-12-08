var
  should = require('should');

describe('ConfigManager', function() {
  describe('Class', function() {
    it('should be defined', function() {
      var
        ConfigManager = require('../../src/ConfigManager'),
        cfgMgr = new ConfigManager();
      cfgMgr.should.be.ok;
    });
  });
  describe('#setConfigLocation', function() {
    it('sets the configuration location file', function() {
      var
        ConfigManager = require('../../src/ConfigManager'),
        cfgMgr = new ConfigManager(),
        valueToTest = 'src/test.json';
      cfgMgr.setConfigLocation({
        location: valueToTest
      });
      cfgMgr.getConfigLocation().should.eql(valueToTest);
    });
  });
  describe('#_loadFile', function() {
    it('should load the file', function(done) {
      var
        ConfigManager = require('../../src/ConfigManager'),
        cfgMgr = new ConfigManager({
          autoLoad: false
        });
      cfgMgr.setConfigLocation({
        location: '../../test/fixtures/cfg1.json'
      });
      cfgMgr._loadFile({
        callback: function(err, data) {
          //console.log('#_loadFile test', err, data);
          if (err) {
            done();
          }
          JSON.parse(cfgMgr._fileContent).app.host.should.eql('kadiks.net');
          done();
        }
      });
    });
  });
  describe('#_loadArgs', function() {
    it('should get the arguments', function() {
      var
        ConfigManager = require('../../src/ConfigManager'),
        cfgMgr = new ConfigManager({
          autoLoad: false
        });
      cfgMgr._loadArgs({
        args: ['node', 'app.js', 'unusableArg', 'usable.arg.first=1', 'usable.arg.second=2']
      });
      cfgMgr._cfgArg.should.eql({
        usable: {
          arg: {
            first: 1,
            second: 2
          }
        }
      });
    });
  });
  describe('#_cleanArgs', function() {
    it('should clean and return the good arguments', function() {
      var
        ConfigManager = require('../../src/ConfigManager'),
        cfgMgr = new ConfigManager({
          autoLoad: false
        });
      cfgMgr._cleanArgs({
        args: ['node', 'app.js', 'unusableArg', 'usable.arg.first=1', 'usable.arg.second=2']
      }).should.eql(['usable.arg.first=1', 'usable.arg.second=2']);
    });
  });
  describe('#_turnArgsToCfg', function() {
    it('should turn the arguments to a config object', function() {
      var
        ConfigManager = require('../../src/ConfigManager'),
        cfgMgr = new ConfigManager({
          autoLoad: false
        });

      cfgMgr._turnArgsToCfg({
        args: ['usable.arg.first=1', 'usable.arg.second=2']
      }).should.eql({
        usable: {
          arg: {
            first: 1,
            second: 2
          }
        }
      });
    });
  });
  describe('#_createDeepObject', function() {
    var
      ConfigManager = require('../../src/ConfigManager'),
      cfgMgr = new ConfigManager({
        autoLoad: false
      });

    cfgMgr._createDeepObject({
      key: 'usable.arg.second',
      val: '2',
      configObject: {
        usable: {
          arg: {
            first: 1
          }
        }
      }
    }).should.eql({
      usable: {
        arg: {
          first: 1,
          second: 2
        }
      }
    });
  });
  describe('#get', function() {
    it('should get the parameter from the file', function(done) {
      var
        ConfigManager = require('../../src/ConfigManager'),
        cfgMgr = new ConfigManager({
          autoLoad: false
        });
      cfgMgr.setConfigLocation({
        location: '../../test/fixtures/cfg1.json'
      });
      cfgMgr._loadFile({
        callback: function(err, data) {
          //console.log('#_loadFile test', err, data);
          if (err) {
            done();
          }
          cfgMgr.get({
            key: 'app.host'
          }).should.eql('kadiks.net');
          done();
        }
      });
    });
  });
  describe('#_getDeepValue', function() {
    it('should return the value', function() {
      var
        ConfigManager = require('../../src/ConfigManager'),
        cfgMgr = new ConfigManager({
          autoLoad: false
        });

      cfgMgr._getDeepValue({
        key: 'usable.arg.first',
        configObject: {
          usable: {
            arg: {
              first: 1
            }
          }
        }
      }).should.eql(1);
    });
  });
});
