define [
    "backbone"
    "marionette"
    "vent"
    "when"
    "moment"
    "superagent"
    "baseBlockController"
    "baseComponent"
    "modules/flightStats/data/model/autocomplete/flightModel"
    "modules/flightStats/data/model/textinput/flightNumberModel"
    "controlContainerService"
    "modules/flightStats/utils/filterData"
    "modules/flightStats/utils/isCoincidence"
    "modules/flightStats/utils/cleanData"
    "utils/date/isValidDate"
], (Backbone, Marionette, vent, When, moment, request, BaseBlockController, BaseComponent, FlightModel, FlightNumberModel, controlContainerService, filterData, isCoincidence, cleanData, isValidDate) ->

    return class FlightStatsController extends BaseBlockController

        flightStatesSearchRequest: {}

        initialize: (options) ->
            @moduleToExposeResults = "flightStatsResult"

            @method = "POST" unless @method
            @dataModel = new Backbone.Model() unless @dataModel
            @collection = new Backbone.Collection() unless @collection
            @region = Marionette.getOption @, "region"
            @declaration = Marionette.getOption @, "declaration"

            @addValidationPattern()

            @component = new BaseComponent
                declaration: @declaration
                context: @
                region: @region

            _.bindAll @, 
                "onSwitchSelected"
                "onItemAdded"
                "onControlRendered"
                "onCollectData"
                "onFlightStatsProcessData"
                "onFocusNext"
                "getStartDate"

            @on "switch:selected", @onSwitchSelected

            # events from baseComponent items and baseComponent controls (controls will be loaded into items)
            @on "component:collection:item:added", @onItemAdded
            @on "component:control:rendered", @onControlRendered

            # collect and process data
            @on "collect:data", @onCollectData

            # "flightstats:process:data" event defined in declaration as button control triggerEvent
            @on "flightstats:process:data", @onFlightStatsProcessData

            # when focus must be passed to the following element
            @on "focus:next", @onFocusNext

            @flightStatesSearchRequest.applicationId = "4352345343"
            @flightStatesSearchRequest.segments = []

            # startDate can be changed from external module, so eventStream created
            @startDateStream = @.asEventStream("startdate:changed")
                .map @getStartDate

            # and subscribe to changes
            @startDateStream.onValue (startDate) =>
                When(@flightStatesSearchRequest.segments[0]).then (target) ->
                    target.startDate = startDate

            # default startDate - current date
            @setDate "now"

            @initSegment(0)

        addValidationPattern: ->
            _.extend( Backbone.Validation.patterns, {flightNumber: /^\s*(([a-zA-Zа-яА-Я]{1}[0-9]{1})|([0-9]{1}[a-zA-Zа-яА-Я]{1})|([a-zA-Zа-яА-Я]{2})){1}\s*([0-9]{1,4})\s*$/} )

        # when form search button will be clicked
        # we have to test data on coincidence
        onFlightStatsProcessData: ->
            segment = @getSegment(0)
            if !segment["flightNumber"] and (!segment["startPoint"] or !segment["endPoint"])
                @showMessage(@prepareLocalized("loc_NotBlankMessage", "string"))
                @activateButton()
                return

            if !isCoincidence(segment)
                @hideMessage()
                @sendAjax()
            else
                @showMessage(@prepareLocalized("loc_info.booking.variant.cityDuplication", "string"))
                @activateButton()

        # will be called after component:collection:item:added - i.e. ControlItemView instance (it is not equial control - it's only a hole for control rendering)
        onItemAdded: (item) ->
            # do smth with item

        # will be called after component:control:rendered
        # param @controlItem - the control view personally (it was loaded and rendered in ControlItemView instance)
        onControlRendered: (controlItem) ->
            if @inputErrorHandlerCid == controlItem.cid
                @errorHandlerControl = controlItem

        initSegment: (index) ->
            if !@flightStatesSearchRequest.segments[index]
                @flightStatesSearchRequest.segments[index] = {startDate: @startDate}

        getSegment: (index) ->
            return @flightStatesSearchRequest.segments[index]

        getErrorHandlerControl: () ->
            return @errorHandlerControl

        getItemByIndex: (index) ->
            return @component.getControlByIndex(index)

        setComponentRegion: (region) ->
            @component.region = region

        onSwitchSelected: (switchOption) ->
            if switchOption is "Route"
                @routeRule()                
            else if switchOption is "FlightNumber"
                @flightNumberRule()
        
        showMessage: (errorMsg) ->
            @errorHandlerControl.show(errorMsg)

        hideMessage: () ->
            if @errorHandlerControl
                @errorHandlerControl.hide()

        show: ->
            @component.show()
            # for @onShow triggering
            @triggerMethod "show"

        onShow: ->
            @itemFlightNumber = @getItemByIndex(1)
            @itemFlightFrom = @getItemByIndex(2)
            @itemFlightTo = @getItemByIndex(3)

            # TODO: remove later! (development trick - do not fill form by hand)
            @forceFormFillingAndSearch()

        routeRule: ->
            # hide flightnumber input
            @itemFlightNumber.hide()
            # and show from-to
            @itemFlightFrom.show()
            @itemFlightTo.show()
            @hideMessage()

            # clean defined field from 0-indexed segment
            cleanData(@getSegment(0), "flightNumber")

        flightNumberRule: ->
            # show flightnumber input
            @itemFlightNumber.show()
            # hide from-to
            @itemFlightFrom.hide()
            @itemFlightTo.hide()
            @hideMessage()
            
            # clean defined fields from 0-indexed segment
            cleanData(@getSegment(0), ["startPoint", "endPoint"])

        close: ->
            @component.close()

        # TODO: maybe some optimization needed
        onCollectData: (model) ->
            inputName = model.get("inputName")

            if inputName in ["flightFrom", "flightTo"]
                validationModel = new FlightModel
                    id: parseInt(model.get("id"))
                    type: model.get "type"
                param = ["id", "type"]
            else if inputName is "flightNumber"
                validationModel = new FlightNumberModel
                    flightNumber: model.get "flightNumber"
                param = "flightNumber"

            if validationModel and validationModel.isValid(param)
                @collectData model

        collectData: (model) ->
            @collection.add model, {merge: true}

            segmentBit = filterData model

            @updateFlightStatesSearchRequestSegments 0, segmentBit

        updateFlightStatesSearchRequestSegments: (index, obj) -> 
            @flightStatesSearchRequest.segments[index] = _.extend @flightStatesSearchRequest.segments[index], obj

        # we are going to inplement sterling rest client ...
        # triggering "flight:search:result" event for catch it in mediator.coffee
        sendAjax: ->
            request.post(@action).send(@flightStatesSearchRequest).set("Accept", "application/json").end (res) =>
                if res.ok
                    vent.trigger "flight:search:result", res.body, @moduleToExposeResults
                    @activateButton()
                else
                    console.log  "ERROR " + res.text

        activateButton: ->
            # isResolved is baseComponent itemView method for indication the moment when control is loaded to itemView
            When(@component.getControlByTypeName("buttonControl").isResolved()).then((target) =>
                target.callPublic("setActive", true)
            )

        onFocusNext: ->
            $(':focus').focusNextInputField()

        # public method
        # can be invoked in mediator by moduleHash method call
        # @param {String} date - searching date parameter; can be one of ["yesterday", "now", "tomorrow"], or date in format "YYYY-MM-DD"
        setDate: (date) ->
            if !_.isString date
                # TODO: throw error not working (on the reason of promise architecture?)
                console.log "Date is not string!"
                return
            if date not in ["yesterday", "now", "tomorrow"] and !isValidDate date
                # TODO: throw error not working (on the reason of promise architecture?)
                console.log "Date is not valid!"
                return

            switch date
                when "yesterday" then @setStartDate(moment().add('days', -1).format("YYYY-MM-DD"))
                when "tomorrow" then @setStartDate(moment().add('days', 1).format("YYYY-MM-DD"))
                when "now" then @setStartDate(moment().format("YYYY-MM-DD"))
                else @setStartDate(date)

        setStartDate: (date) ->
            @startDate = date
            @trigger "startdate:changed"

        getStartDate: ->
            return @startDate

        # public method - for form data committing
        # TODO: send ajax directly, without force button click (TODO: data should be validated)
        commitFormData: ->
            $(".flightStats input.buttonControl").click()

        # debug, remove later
        forceFormFillingAndSearch: ->
            When(@itemFlightFrom.isResolved()).then (target) =>
                target.callPublic "dropDownSelectedImitation", {
                    model: new Backbone.Model
                        codeIata: "MOW"
                        codeSirena: "МОВ"
                        countryName: "Роccия"
                        id: "1"
                        inputName: "flightFrom"
                        itemClassName: "flightPointItem"
                        itemHeight: 25
                        itemStringLength: 40
                        modelIndex: 0
                        name: "Москва"
                        type: "CITY"
                }

            When(@itemFlightTo.isResolved()).then (target) =>
                target.callPublic "dropDownSelectedImitation", { 
                    model: new Backbone.Model
                        codeIata: "PAR"
                        codeSirena: "ПАЖ"
                        countryName: "Франция"
                        id: "1995"
                        inputName: "flightTo"
                        itemClassName: "flightPointItem"
                        itemHeight: 25
                        itemStringLength: 41
                        modelIndex: 4
                        name: "Париж"
                        type: "CITY"
                }

                # send data to server
                @commitFormData()
                


