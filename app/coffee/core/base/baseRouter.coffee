define [
    "marionette"
    "routeProcessor"
    "_.str"
], (Marionette, routeProcessor) ->

    class BaseRouter extends Marionette.AppRouter

        triggerMethod: Marionette.triggerMethod

        # as routeProcessor is singleton, it will be recieved as injection
        routeProcessor: routeProcessor

        initialize: (options) ->
            @processConfiguration()

        processConfiguration: () ->
            @routeConfiguration = @routeProcessor.getRouteMap()
            routes = _.keys @routeConfiguration
            @makeNewConfigRouteMethod route for route in routes

        makeNewConfigRouteMethod: (route) =>
            method = @toMethodName route

            config = @routeConfiguration[route]
            @controller[method] = @initRouteMethod route
            @appRoutes[route] = method

        toMethodName: (route) ->
            fragments = @routeProcessor.getFragments route

            if fragments[0] == "!"
                fragments.shift()

            # each method will be prefixed with "do"
            res = "do"

            if !fragments.length
                return res + "Default"
            else
                for f in fragments
                    if _.str.include f, "-"
                        f = _.str.camelize f
                    res += _.str.capitalize f

                return res

        initRouteMethod: (route) ->
            func = () =>
                param = Array::slice.call(arguments, 0)

                # get page configuration, when the event will be triggered (when route must be served)
                @triggerMethod "route:config",
                    route: route
                    param: param

            return func

    return BaseRouter









                
