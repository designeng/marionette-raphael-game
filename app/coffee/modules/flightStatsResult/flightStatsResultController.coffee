define [
    "marionette"
    "backbone"
    "vent"
    "baseBlockController"
    "baseComponent"
    "when"
    "modules/flightStatsResult/result/resultModel"
    "filterBaseMediator"
    "preloader"
    "utils/collection/dictionary/createDictionary"
    "modules/flightStatsResult/utils/createCollection"
    "hbs!templates/modules/flightStats/flightStatsStartPage"
], (Marionette, Backbone, vent, BaseBlockController, BaseComponent, When, ResultModel, FilterTableMediator, Preloader, createDictionary, createCollection, flightStatsStartPageTpl) ->

    return class FlightStatsResultController extends BaseBlockController
        initialize: (options) ->
            @region = Marionette.getOption @, "region"
            @declaration = Marionette.getOption @, "declaration"

            @filterTableMediator = @getFilterTableMediator()

            # TODO: instead of preloader may be better simple template control
            # then getByIndex insead of get by name
            @preloader = new Preloader
                template: flightStatsStartPageTpl
                model: new Backbone.Model
                    text: "loading..."

            @component = new BaseComponent
                declaration: @declaration
                context: @
                region: @region

            _.bindAll @, 
                "displayFlightsData"
                "showComponent"
                "exposeComponent"
                "showErrorMessage"

        exposeComponent: (data) ->
            @showComponent()
            @triggerMethod "component:exposed"

            # status pleaseWaitWhileSearching - ?

            if _.isEmpty data
                vent.trigger "flight:stats:data:empty"
                # flightPointNotFound defined in declaration in infoStateModel
                @displayResultStatus("flightPointNotFound")
            else
                errors = data.properties.errors
                if errors.length == 0

                    # airTrips {Array}
                    airTrips = data.data.flightStates[0].airTrips
                    
                    if airTrips.length
                        @displayFlightsData(data)
                    else
                        # no flights in result
                        # defined in declaration in infoStateModel
                        @displayResultStatus("flightsNotFoundGotoSchedule")
                else
                    @showErrorMessage(errors[0])

        onComponentExposed: ->
            @infoStateItem = @component.getControlByTypeName("infoControl")
            @infoStateItem.hide()

        getFilterTableMediator: ->
            return filterTableMediator = new FilterTableMediator

        # will be called just after this controller initialization
        # TODO: move @preloader to another place
        show: ->
            @region.show @preloader

        showComponent: () ->
            @component.show()

        displayFlightsData: (data) ->
            @dictionary = @setDictionaries(data)
            @tableCollection = createCollection.call(data, @dictionary)

            console.log @tableCollection

            # all models <airport...Name> must be equial, so get it from the first model
            airportDepartureName = @tableCollection.at(0).get "airportDepartureName"
            airportArrivalName = @tableCollection.at(0).get "airportArrivalName"

            # promise provides an assurance that control is created
            When(@component.getControlByTypeName("tableControl").isResolved()).then((target) =>
                target.callPublic("exposeCollection", @tableCollection)

                console.log @tableCollection

                @filterTableMediator.setTableCollection @tableCollection
                @filterTableMediator.trigger "tableCollection:change"
            )

            When(@component.getControlByTypeName("simpleTplControl").isResolved()).then((target) =>
                # arrival and departure points must be shown
                target.callPublic("setTemplateField", "fromField", airportDepartureName)
                target.callPublic("setTemplateField", "toField", airportArrivalName)
            )

        displayResultStatus: (status) ->
            console.log status
            @infoStateItem.show()
            When(@component.getControlByTypeName("infoControl").isResolved()).then((target) =>
                target.callPublic("setInfoCases", status)
            )

        setDictionaries: (data) ->
            return createDictionary(["AIRPORT", "AIRCOMPANY", "AIRPLANE", "CITY", "FLIGHT_STATE"], data)

        showErrorMessage: (err) ->

