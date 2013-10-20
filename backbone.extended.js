/* backbone.extended.js v0.0.4 (coffeescript output) */ 

(function() {
  var Backbone, capitalize, extensions, moduleType, _fn, _i, _len, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Backbone = this.Backbone || typeof require === 'function' && require('backbone');

  Backbone.Extended = {};

  extensions = Backbone.extensions != null ? Backbone.extensions : Backbone.extensions = function(name, fn) {
    return this[name] = fn;
  };

  extensions.all || (extensions.all = extensions);

  capitalize = function(str) {
    if (str) {
      return str[0].toUpperCase() + str.substring(1);
    } else {
      return '';
    }
  };

  _ref = ['Model', 'Router', 'View', 'Collection'];
  _fn = function(moduleType) {
    var moduleTypeLowercase;
    moduleTypeLowercase = moduleType.toLowerCase();
    extensions[moduleTypeLowercase] || (extensions[moduleTypeLowercase] = function(name, fn) {
      return this[name] = fn;
    });
    return Backbone.Extended[moduleType] = (function(_super) {
      __extends(_Class, _super);

      function _Class() {
        var args, config, currentKey, extension, extensionFn, globalConfig, isModelOrCollection, key, mixin, options, res, type, value, _j, _len1, _ref1, _ref2,
          _this = this;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _Class.__super__.constructor.apply(this, arguments);
        isModelOrCollection = moduleType === 'Model' || moduleType === 'Collection';
        options = isModelorCollection ? args[1] : args[0];
        _ref1 = ['all', moduleTypeLowercase];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          type = _ref1[_j];
          globalConfig = extensions[type].defaults;
          config = _.extend({}, globalConfig, this.extensions, options.extensions);
          this._extensionConfig = config;
          for (key in config) {
            value = config[key];
            if (value) {
              extension = extensions[type];
              if (typeof extension === 'function') {
                extensionFn = extensions[type][key] || extensions.all[key];
                res = extensionFn.call.apply(extensionFn, [this, this, value].concat(__slice.call(args)));
              } else {
                (_ref2 = extension.constructor).call.apply(_ref2, [this, this, value].concat(__slice.call(args)));
                res = extension;
              }
              if (res) {
                mixin = {};
                for (key in res) {
                  value = res[key];
                  currentKey = this[key];
                  if (key !== 'constructor') {
                    (function(key, value, currentKey) {
                      mixin[key] = function() {
                        var originalSuper;
                        originalSuper = this._super;
                        this._super = currentKey;
                        res = value.call.apply(value, [this].concat(__slice.call(arguments)));
                        this._super = originalSuper;
                        return res;
                      };
                      return _.extend(_this, mixin);
                    })(key, value, currentKey);
                  }
                }
              }
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

  Backbone.Extended.VERSION = '0.0.4';

}).call(this);
