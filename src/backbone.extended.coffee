Backbone = @Backbone or typeof require is 'function' and require 'backbone'

Backbone.Extended = {}
extensions = Backbone.extensions ?= (name, fn) -> @[name] = fn
extensions.all or= extensions

capitalize = (str) ->
  if str then ( str[0].toUpperCase() + str.substring 1 ) else ''

for moduleType in [ 'Model', 'Router', 'View', 'Collection' ]
  do (moduleType) ->
    moduleTypeLowercase = moduleType.toLowerCase()
    extensions[moduleTypeLowercase] or= (name, fn) -> @[name] = fn

    class Backbone.Extended[moduleType] extends Backbone[moduleType]
      constructor: (args...) ->
        super
        isModelOrCollection = moduleType in [ 'Model', 'Collection' ]
        options = if isModelOrCollection then args[1] else args[0]

        for type in ['all', moduleTypeLowercase]
          globalConfig = extensions[type].defaults
          config = _.extend {}, globalConfig, @extensions, options.extensions
          @_extensionConfig = config
          for key, value of config
            if value
              extension = extensions[type]
              if typeof extension is 'function'
                extensionFn = extensions[type][key] or extensions.all[key]
                res = extensionFn.call @, @, value, args...
              else
                extension.constructor.call @, @, value, args...
                res = extension
              if res
                mixin = {}
                for key, value of res
                  currentKey = @[key]
                  if key isnt 'constructor'
                    do (key, value, currentKey) =>
                      mixin[key] = ->
                        originalSuper = @_super
                        @_super = currentKey
                        res = value.call @, arguments...
                        @_super = originalSuper
                        res

                      _.extend @, mixin

Backbone.Extended.VERSION = '0.0.4'
