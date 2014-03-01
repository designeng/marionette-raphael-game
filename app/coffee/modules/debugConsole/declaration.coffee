define [
    "marionette"
    "boxModel"
], (Marionette, BoxModel)->

    declaration =         
        componentItems: [{controlType: "boxControl", controlModel: new BoxModel(
                            text: "FORM DATA HERE"
                            className: "formDataCollector"
                        )}
                    ]        
