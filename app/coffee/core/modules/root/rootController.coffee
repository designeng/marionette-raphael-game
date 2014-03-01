define [
    "marionette"
    "rootRouter" 
], (Marionette, RootRouter) ->

    RootController = Marionette.Controller.extend
        initialize: (options) ->
            @module = Marionette.getOption @, "module"

            @module.router = new RootRouter
                context: @module

            @module.router.bind "all", (route, router) ->
                # console.log "Different Page: " + route + " " + router
