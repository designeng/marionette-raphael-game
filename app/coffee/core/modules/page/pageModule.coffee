define [
    "marionette"
    "vent"
    "meld"
    "baseModule"
    "pageController"
], (Marionette, vent, meld, BaseModule, PageController) ->

    class PageModule
        constructor: (options) ->
            @module = new BaseModule
                    name: "pageModule"
                    controller: new PageController
                        region: options.region
                    startWithParent: false

            @initListeners()          

        start: () ->
            @module.start()

        initListeners: ->
            vent.on "display:modules", (evtData) =>
                @module.getController().displayModules evtData