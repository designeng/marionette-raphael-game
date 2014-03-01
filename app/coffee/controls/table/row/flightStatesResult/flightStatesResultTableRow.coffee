define [
    "backbone"
    "marionette"
    "moment"
    "hbs!templates/modules/flightStatsResult/flightStatsResultTableRowTpl"
], (Backbone, Marionette, moment, flightStatsResultTableRowTpl) -> 

    FlightStatesResultTableRowView = Marionette.ItemView.extend

        template: flightStatsResultTableRowTpl

        tagName: "tr"

        initialize: ->
            @applyOptions([
                "columns"
                "itemHeight"
            ])

            # @_columns as usial for tableControl can consist information about visible fields, 
            # but here we choose another rendering tactic
            # because table is not quite simple:
            # just push them to model - Handelbars will do all the rest.

            @model.set("formatDate", @getFormatDate())

            console.log "mergedFlightsInfo", @model.get "mergedFlightsInfo"

        getFormatDate: ->
            currentTime         = moment().format('YYYY-MM-DD HH:mm')
            plannedDepartureTime= @model.get("plannedDepartureDate") + " " + @model.get("plannedDepartureTime")
            actualDepartureTime = @model.get("actualDepartureDate") + " " + @model.get("actualDepartureTime")
            plannedArrivalTime  = @model.get("plannedArrivalDate") + " " + @model.get("plannedArrivalTime")
            actualArrivalTime   = @model.get("actualArrivalDate") + " " + @model.get("actualArrivalTime")

            return oFormatDate = 
                planDepTime         : moment(plannedDepartureTime).format('h:mm')
                actDepTime          : moment(actualDepartureTime).format('h:mm')
                planActDepSameTime  : moment(plannedDepartureTime).isSame(actualDepartureTime)

                planArrTime         : moment(plannedArrivalTime).format('h:mm')
                actArrTime          : moment(actualArrivalTime).format('h:mm')
                planActArrSameTime  : moment(plannedArrivalTime).isSame(actualArrivalTime)
                dayAfterArrDate     : moment(@model.get("plannedArrivalDate")).isAfter(@model.get("plannedDepartureDate"))

        # computeStatusTime: ->
        #     currentTime = moment().format('YYYY-MM-DD HH:mm')

        #     _plannedDepartureTime = @model.get("plannedDepartureDate") + " " + @model.get("plannedDepartureTime")
        #     _actualDepartureTime = @model.get("actualDepartureDate") + " " + @model.get("actualDepartureTime")
        #     _actualArrivalTime = @model.get("actualArrivalDate") + " " + @model.get("actualArrivalTime")

        #     if moment(_plannedDepartureTime).isBefore(currentTime) and moment(_actualDepartureTime).isAfter(currentTime)
        #         return @model.get("actualDepartureTime")
        #     else if moment(_actualDepartureTime).isBefore(currentTime) and moment(_actualArrivalTime).isAfter(currentTime)
        #         return @model.get("actualArrivalTime")
        #     else
        #         return "empty"


        # comparators: moment wrappers
        # maybe we must use original moment.js methods isBefore and isAfter

        # @param {String} a
        # @param {String} b
        isBefore: (a, b) ->
            return moment(a).format("X") < moment(b).format("X")

        # @param {String} a
        # @param {String} b
        isAfter: (a, b) ->
            return moment(a).format("X") > moment(b).format("X")

        # / comparators: moment wrappers

        onRender: ->
            @setHeight @itemHeight if @itemHeight

        setHeight: (h) ->
            @$el.css "height", h