define [
    "marionette"
    "baseBlockController"
    "baseComponent"
    "hbs!templates/modules/flightSearchHistory/flightSearchHistoryTpl"
    "modules/flightSearchHistory/declaration"
    "localstorage"
], (Marionette, BaseBlockController, BaseComponent, FlightSearchHistoryTpl, declaration) ->

    class FlightSearchHistoryController extends BaseBlockController
        initialize: ->
            @applyOptions([
                "region"
                "declaration"
                ])

            @component = new BaseComponent
                classWrapper: 'flightSearchHistory'
                declaration: @declaration
                context: @
                region: @region
                template: FlightSearchHistoryTpl

        show: ->
            @component.show()

        hide: ->
            @region.close()
