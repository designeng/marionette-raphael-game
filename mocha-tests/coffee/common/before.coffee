define [
    "marionette"
    "Handlebars"
    "appbootstrap"
    "moduleHash"
    "handlebarsHelpers"
    "extended"
], (Marionette, Handlebars, App, moduleHash) ->

    appStarted = false

    startBaseApplication = ->
        console.log "startBaseApplication"
        routeMap = 
            "!/":
                "header" : []
                "content": []
                "footer" : []

            "!/header":
                "header"    : ["header"]
                "content"   : []
                "footer"    : []

            "!/sorted-table":
                "header"    : []
                "content"   : ["sortedTable"]
                "footer"    : []

            "!/footer":
                "header"    : []
                "content"   : []
                "footer"    : ["footer"]

        App.start(
            routeMap: routeMap
        )

        window.moduleHash = moduleHash

        window.location.href = "/mocha-tests/test2.html#!/header"

        appStarted = true

        return true

    # before
    before ->
        if !appStarted
            startBaseApplication()