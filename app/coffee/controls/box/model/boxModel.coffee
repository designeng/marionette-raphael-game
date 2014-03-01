define ["backbone"], (Backbone) ->
    BoxModel = Backbone.Model.extend
        defaults:
            states:
                "default":{

                }
                "hover":
                    "className": "boxHover"
                "active":{
                    "className": "boxActive"
                }
                "disabled":{
                    "className": "boxDisabled"
                }
            state: "default"
            className: "boxControl"
            callback: null