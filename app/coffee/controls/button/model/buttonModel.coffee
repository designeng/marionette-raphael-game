define ["backbone"], (Backbone) ->
    ButtonModel = Backbone.Model.extend
        defaults:
            caption: "Input"
            states:
                "default":{

                }
                "hover":
                    "className": "buttonHover"
                "active":{
                    "className": "buttonActive"
                }
                "disabled":{
                    "className": "buttonDisabled"
                }
            state: "default"
            callback: null