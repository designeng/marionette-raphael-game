define [
    "backbone"
], (Backbone) ->
    FlightNumberModel = Backbone.Model.extend
        validation:
            id:
                required: true
                pattern: "flightNumber"
                msg: "some message flightNumber error"

