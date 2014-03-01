define [
    "backbone"
], (Backbone) ->
    FlightModel = Backbone.Model.extend
        validation:
            id:
                required: true
                pattern: /^\d+$/
                msg: "some message id error"
            type:
                required: true
                # TODO: what another words can be?
                pattern: /^(CITY|AIRPORT)$/
                msg: "some message type error"

