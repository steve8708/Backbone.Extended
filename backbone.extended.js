/* backbone.extended.js v0.0.2 (coffeescript output) */ 

(function() {
  var capitalize, moduleType, _fn, _i, _len, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone.Extended = {};

  Backbone.extensions || (Backbone.extensions = {});

  capitalize = function(str) {
    if (str) {
      return str[0].toUpperCase() + str.substring(1);
    } else {
      return '';
    }
  };

  _ref = ['Model', 'Router', 'View', 'Collection'];
  _fn = function(moduleType) {
    var moduleTypeLowercase, _base;
    moduleTypeLowercase = moduleType.toLowerCase();
    (_base = Backbone.extensions)[moduleTypeLowercase] || (_base[moduleTypeLowercase] = {});
    return Backbone.Extended[moduleType] = (function(_super) {
      __extends(_Class, _super);

      function _Class() {
        var config, globalConfig, key, res, type, value, _j, _len1, _ref1;
        _Class.__super__.constructor.apply(this, arguments);
        _ref1 = ['all', moduleTypeLowercase];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          type = _ref1[_j];
          globalConfig = Backbone.extensions[type].defaults;
          config = _.extend({}, globalConfig, this.extensions);
          for (key in config) {
            value = config[key];
            if (value) {
              res = Backbone.extensions[type].call(this, config);
              _.extend(this, res);
            }
          }
        }
      }

      return _Class;

    })(Backbone[moduleType]);
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    moduleType = _ref[_i];
    _fn(moduleType);
  }

  Backbone.Extended.VERSION = '0.0.2';

}).call(this);
