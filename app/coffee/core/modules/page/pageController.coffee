define [
    "marionette"
    "when"
    "pageLayout"
    "regionModuleRegistrator"
], (Marionette, When, Layout, RegionModuleRegistrator) ->

    PageController = Marionette.Controller.extend
        initialize: (options) ->
            @region = Marionette.getOption @, "region"
            @regionModuleRegistrator = new RegionModuleRegistrator()

        show: ->
            @layout = new Layout(
                model: new Backbone.Model()
            )
            @region.show @layout

        hide: ->
            @region.close()

        # displayModules in public api of pageModule
        # @param {Object} evtData Event data
        # @param {Object} evtData.map Page map (page configuration)
        # @param {Object} evtData.param Additional param
        displayModules: (evtData) ->
            # store current page map in @pageMap
            @pageMap = evtData.map
            param = evtData.param

            console.log "displayModules", @pageMap

            When(@regionModuleRegistrator.registerPageConfig @pageMap).then((pageStructure) =>
                    @runDisplayProcess pageStructure
                )

        # display process imposed externally - in @layout
        runDisplayProcess: (pageStructure) ->
            @layout.processPageStructure pageStructure

        # @return {Object} - current pageMap
        getPageMap: ->
            return @pageMap
