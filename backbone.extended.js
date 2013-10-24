(function() {
  var Backbone, capitalize, defaults, extensions, moduleType, _fn, _i, _len, _ref,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

  defaults = function() {
    var args, key, value;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length === 1) {
      defaults = args[0];
    } else {
      defaults = {};
      defaults[args[0]] = args[1];
    }
    for (key in defaults) {
      value = defaults[key];
      this[key] = value;
    }
    return this;
  };

  extensions.defaults = defaults;

  _ref = ['Model', 'Router', 'View', 'Collection'];
  _fn = function(moduleType) {
    var moduleTypeLowercase, _base;
    moduleTypeLowercase = moduleType.toLowerCase();
    extensions[moduleTypeLowercase] || (extensions[moduleTypeLowercase] = function(name, fn) {
      return this[name] = fn;
    });
    (_base = extensions[moduleTypeLowercase]).defaults || (_base.defaults = defaults);
    return Backbone.Extended[moduleType] = (function(_super) {
      __extends(_Class, _super);

      function _Class() {
        var args, config, currentKey, extension, extensionFn, globalConfig, globalDefaults, isModelOrCollection, key, mixin, moduleTypeDefaults, options, res, type, value, _ref1,
          _this = this;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _Class.__super__.constructor.apply(this, arguments);
        isModelOrCollection = moduleType === 'Model' || moduleType === 'Collection';
        options = isModelOrCollection ? args[1] : args[0];
        options || (options = {});
        type = moduleTypeLowercase;
        if (this.plugins.ignoreGlobalDeafults) {
          globalDefaults = {};
        } else {
          globalDefaults = extensions.all.defaults;
        }
        moduleTypeDefaults = extensions[type].defaults;
        globalConfig = _.extend(globalDefaults, moduleTypeDefaults);
        config = _.extend({}, globalConfig, this.extensions, options.extensions, this.plugins, options.plugins);
        this._extensionConfig = config;
        for (key in config) {
          value = config[key];
          if (value) {
            extension = extensions[type];
            if (typeof extension === 'function') {
              extensionFn = extensions[type][key] || extensions.all[key];
              if (extensionFn) {
                res = extensionFn.call.apply(extensionFn, [this, this, value].concat(__slice.call(args)));
              }
            } else {
              (_ref1 = extension.constructor).call.apply(_ref1, [this, this, value].concat(__slice.call(args)));
              res = extension;
            }
            if (res) {
              mixin = {};
              for (key in res) {
                value = res[key];
                currentKey = this[key];
                if (typeof value === 'function' && key !== 'constructor') {
                  (function(key, value, currentKey) {
                    mixin[key] = function() {
                      var originalSuper;
                      originalSuper = this._super;
                      this._super = currentKey;
                      res = value.apply(this, arguments);
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

      return _Class;

    })(Backbone[moduleType]);
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    moduleType = _ref[_i];
    _fn(moduleType);
  }

  Backbone.Extended.VERSION = '0.1.0';

}).call(this);
