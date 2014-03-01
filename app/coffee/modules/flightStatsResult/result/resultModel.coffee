define ["backbone"], (Backbone) ->
    resultModel = Backbone.Model.extend
        defaults:
            marketingCompanyId: "marketingCompanyId"
            flightNumber: "flightNumber"

            plannedDepartureDate: "plannedDepartureDate"
            plannedDepartureTime: "plannedDepartureTime"

            actualDepartureDate: "actualDepartureDate"
            actualDepartureTime: "actualDepartureTime"

            originId: "originId"
            originTerminal: "originTerminal"
            originGate: "originGate"

            flightStateId: "flightStateId"