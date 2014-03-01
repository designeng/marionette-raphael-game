require [
    "appbootstrap"
    "routemap"
], (App, routeMap) ->

    options = 
        routeMap: routeMap

    App.start(options)