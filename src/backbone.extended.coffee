Backbone.Extended = {}
Backbone.extensions or= {}

capitalize = (str) ->
  if str then ( str[0].toUpperCase() + str.substring 1 ) else ''

for moduleType in [ 'Model', 'Router', 'View', 'Collection' ]
  do (moduleType) ->
    moduleTypeLowercase = moduleType.toLowerCase()
    Backbone.extensions[moduleTypeLowercase] or= {}

    class Backbone.Extended[moduleType] extends Backbone[moduleType]
      constructor: ->
        super
        for type in ['all', moduleTypeLowercase]
          globalConfig = Backbone.extensions[type].defaults
          config = _.extend {}, globalConfig, @extensions
          for key, value of config
            if value
              res = Backbone.extensions[type].call @, config
              _.extend @, res

Backbone.Extended.VERSION = '0.0.1'