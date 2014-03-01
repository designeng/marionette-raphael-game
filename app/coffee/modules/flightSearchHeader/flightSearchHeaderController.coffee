define [
    "marionette"
    "baseBlockController"
    "baseComponent"
    "hbs!templates/modules/flightSearchHistory/flightSearchHistoryTpl"
    "modules/flightSearchHistory/declaration"
    "localstorage"
], (Marionette, BaseBlockController, BaseComponent, FlightSearchHistoryTpl, declaration) ->

    class FlightSearchHeaderController extends BaseBlockController
        initialize: ->
            @applyOptions([
                "region"
                "declaration"
                ])

            @component = new BaseComponent
                classWrapper: 'flightSearchHeader'
                declaration: @declaration
                context: @
                region: @region
                template: FlightSearchHistoryTpl

        show: ->
            @component.show()

        hide: ->
            @region.close()
