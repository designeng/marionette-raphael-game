define [
    "backbone"
    "marionette"
    "Handlebars"
    "appinstance"
    "vent" 
    "rootModule"
    "pageModule"
    "handlebarsHelpers"
    "overridden"
    "extended"
], (
    Backbone
    Marionette
    Handlebars
    App
    vent
    rootModule
    PageModule
) ->

    App.on "initialize:before", (options) ->
        rootModule.start(options)

    App.on "initialize:after", ->
        Backbone.history.start()
        Backbone.history.bind "all", (route, router) ->
            vent.trigger "history:changed", {hash: window.location.hash}

    App.addInitializer ->

        pageModule = new PageModule                            # PageModule is wrapper for BaseModule object - but BaseModule returns Marionette.Module
            region: App.application

        pageModule.start()      

    ApplicationRegion = Marionette.Region.extend                # here we create the region of new type: ApplicationRegion
        el: "#application"
        onShow: ->
            vent.trigger "appregion:showed"

    # add App regions
    App.addRegions application: ApplicationRegion

    App.addRegions debug: "#debug"
    App.addRegions debugMore: "#debug-more"

    return App
