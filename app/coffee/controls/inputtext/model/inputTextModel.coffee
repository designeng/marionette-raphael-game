define ["backbone"], (Backbone) ->
    InputTextModel = Backbone.Model.extend
        defaults:
            states:
                "default":{
                    # is equial regular className?
                }
                "hover":
                    "className": "inputTextHover"
                "active":
                    "className": "inputTextActive"
                "focus":
                    "className": "inputTextFocus"
                "disabled":
                    "className": "inputTextDisabled"
                "invalid":
                    "className": "inputTextInvalid"

            isValid: null
            required: false
            regexp: null
            mask: null
            placeHolder: null
            autoComplete: "off"
            startInputLength: 0