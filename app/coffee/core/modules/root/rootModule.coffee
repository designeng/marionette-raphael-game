define ["marionette"
        "vent"
        "appinstance"
        "routeProcessor"
        "rootController"
], (Marionette, vent, App, routeProcessor, RootController) ->

    rootModule = App.module "RootModule", (rootModule, App) ->

        rootController = null

        @startWithParent = false

        # routeConfig {Object}
        # routeConfig.route {String}
        # routeConfig.param {String}
        @passRouteConfig = (routeConfig) ->

            # it will be invoked on route change
            # console.log "ROUTED TO", routeConfig.route, "PARAM ARRAY:", routeConfig.param

            pageMap = routeProcessor.makePageConfig routeConfig
            vent.trigger "root:pagemap:created", pageMap
            

        rootModule.on "before:start", (options) ->
            routeProcessor.init(options)

        rootModule.addInitializer (args) ->
            rootController = new RootController (
                    app: App
                    module: rootModule
                )

        rootModule.addFinalizer ->
            if rootController
                rootController.close()
                rootController = null