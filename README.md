# Backbone.Extended

A dead simple plugin architecture for Backbone in under 50 lines of code.

The ultimate goal here is to distill applications development to basic configuration,
through the use of building and configuring reusable components, aka extensions.
Build once, use everywhere, across all of your apps and repos.


### Using Extensions

```coffeescript
Backbone.extensions.view.defaults.lazyLoad = true
Backbone.extensions.view.defaults.fadeInImages = selector: 'fade-me'

class View extends Backbone.Extended.View
  extensions:
    ractive: true
    lazyLoadImages: true
    fadeInImages:
      className: 'fade'
      selector: '.lazy-loaded'
```

### Creating Extensions

```coffeescript
# Plugin code runs on initialize, is called in the context of the module
# it is being applied to, and can retutn methods to apply to the module
Backbone.extensions.view.ractive = (view, config) ->
  @ractive = new Ractive el: @el, template: @template, data: @toJSON()
  @ractive.bind Ractive.adaptors.backboneAssociatedModel @state
  @on 'render', => @ractive.render()

# Applies to all class types (model, router, view, collection)
Backbone.extensions.all.state = (module, config) ->
  @state = new Backbone.Model
  @state.on 'all', (eventName, args…) =>
    @trigger.apply @, ["state:#{eventName}"].concat args

  # You can return methods to apply to the module
  getState: (name) -> @state.get name
  setState: (name, value) -> @state.set name, value

Backbone.extensions.view.fadeInImages = (view, config) ->
  @on 'render', ->
    # You can use config.className or apply config as a function to set defaults
    config = config className: 'hide', selector: 'img'

    $images = @$ config.selector
    $images.addClass config.className
    $images.on 'load', (e) => $(e.target).removeClass config.className

```

Full documentation coming soon...