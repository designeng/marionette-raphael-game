define [
    "backbone"
    "marionette"
], (Backbone, Marionette)->    

    declaration =        
        componentItems: [
                        {controlType: "infoControl", controlModel: new Backbone.Model
                            cases:[
                                {flightPointNotFound: "one"}
                                {flightsNotFoundGotoSchedule: "two"}
                                {test: "loc_Flight"}
                                {support: "loc_SupportService"}
                            ]
                        }
                    ]        
