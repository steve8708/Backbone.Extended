Backbone = @Backbone or typeof require is 'function' and require 'backbone'

Backbone.Extended = {}
extensions = Backbone.extensions ?= (name, fn) -> @[name] = fn
extensions.all or= extensions

capitalize = (str) ->
  if str then ( str[0].toUpperCase() + str.substring 1 ) else ''

defaults = (args...) ->
  if args.length is 1
    defaults = args[0]
  else
    defaults = {}
    defaults[args[0]] = args[1]

  for key, value of defaults
    @[key] = value
  @

extensions.defaults = defaults

for moduleType in [ 'Model', 'Router', 'View', 'Collection' ]
  do (moduleType) ->
    moduleTypeLowercase = moduleType.toLowerCase()

    extensions[moduleTypeLowercase] or= (name, fn) -> @[name] = fn
    extensions[moduleTypeLowercase].defaults or= defaults

    class Backbone.Extended[moduleType] extends Backbone[moduleType]
      constructor: (args...) ->
        super
        isModelOrCollection = moduleType in [ 'Model', 'Collection' ]
        options = if isModelOrCollection then args[1] else args[0]
        options or= {}
        type = moduleTypeLowercase

        if @plugins.ignoreGlobalDeafults
          globalDefaults =  {}
        else
          globalDefaults = extensions.all.defaults

        moduleTypeDefaults = extensions[type].defaults

        globalConfig = _.extend globalDefaults, moduleTypeDefaults
        config = _.extend {}, globalConfig, @extensions,
          options.extensions, @plugins, options.plugins
        @_extensionConfig = config

        # FIXME: break this into separate functions
        for key, value of config
          if value
            extension = extensions[type]
            if typeof extension is 'function'
              extensionFn = extensions[type][key] or extensions.all[key]
              if extensionFn
                res = extensionFn.call @, @, value, args...
            else
              extension.constructor.call @, @, value, args...
              res = extension
            if res
              mixin = {}
              for key, value of res
                currentKey = @[key]
                if typeof value is 'function' and key isnt 'constructor'
                  do (key, value, currentKey) =>
                    mixin[key] = ->
                      originalSuper = @_super
                      @_super = currentKey
                      res = value.apply @, arguments
                      @_super = originalSuper
                      res

                    _.extend @, mixin

Backbone.Extended.VERSION = '0.2.0'
