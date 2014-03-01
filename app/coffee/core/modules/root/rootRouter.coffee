define [
    "baseRouter"
], (BaseRouter) ->

    class RootRouter extends BaseRouter

        controller:
            # No routeMap methods here - they will be created in initRouteMethod

            onRuLocale: ->
                console.log "ru"
                @navigateToLocale("ru")
            onEnLocale: ->
                @navigateToLocale("en")
            onDeLocale: ->
                @navigateToLocale("de")
            onEsLocale: ->
                @navigateToLocale("es")
            onLvLocale: ->
                @navigateToLocale("lv")

            navigateToLocale: (loc) ->
                console.log "switched to locale: " + loc

        appRoutes:
            "!/ru": "onRuLocale"
            "!/en": "onEnLocale"
            "!/de": "onDeLocale"
            "!/es": "onEsLocale"
            "!/lv": "onLvLocale"

        initialize: (options) ->
            options = options || {}
            
            @context = options.context

            super options

        onRouteConfig: (routeConfig) ->
            @context.passRouteConfig routeConfig
