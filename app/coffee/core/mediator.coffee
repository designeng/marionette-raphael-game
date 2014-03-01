define [
    "vent"
    "when"
    "moduleHash"
], (vent, When, moduleHash) ->

    class Mediator

        constructor: ->
            @hash = moduleHash.getHash()

            # events and actions
            vent.on "root:pagemap:created", @onRouteConfigComplited

            vent.on "history:changed", @onHistoryChanged

            vent.on "flight:search:result", @onFlightSearchResult

            # ----------- experimental access to modules (guaranteed loading) ---------------------
            # ----------- uncomment for usage -----------------------------------------------------
            # When(moduleHash.getModuleAsPromise("flightStatsResult")).then (module) ->
            #     console.log "MODULE:::", module

            # and so on
            # ----------- / experimental access to modules (guaranteed loading) ---------------------

        # @param {Object} evtData - search result
        # @param {String} moduleName - module to expose result
        onFlightSearchResult: (evtData, moduleName) =>
            # exposeComponent is the local method of FlightStatsResultController
            @hash[moduleName].exposeComponent(evtData)

        # TODO: may be guaranteed access to modules must be used
        onSearchStartDateSetting: (dateStr, moduleName) =>
            @hash[moduleName].setDate(dateStr)
            @hash[moduleName].commitFormData()

        # config for current route is created, throw it to pageModule
        # TODO: it's core workflow, move it to bootstrap (mediator can not intersect with core)
        onRouteConfigComplited: (pageMap) =>
            vent.trigger "display:modules", pageMap

        onHistoryChanged: (evtData) =>


    return mediator = new Mediator()