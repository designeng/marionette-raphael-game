define ["marionette"
        "meld"
        "modelbinder"
        ], (Marionette, meld) ->

    InputError = Marionette.ItemView.extend

        template: "<span name='errorText' cid='{{inputErrorHandlerCid}}'>{{errorText}}</span>"

        className: "inputError"

        initialize: (options) ->
            @modelBinder = new Backbone.ModelBinder()

            # inputErrorHandlerCid for InputError is treated as @cid
            if @model.has "inputErrorHandlerCid"
                @cid = @model.get "inputErrorHandlerCid"

            _.bindAll @, "show"

        onRender: ->
            if @model.get "display"
                @show()
            else
                @hide()

            @modelBinder.bind @model, @el

        show: (errorText) -> 
            if errorText
                if _.isObject(errorText) and errorText.data
                    @model.set "errorText", errorText.data
                else if _.isString errorText
                    @model.set "errorText", errorText
                else 
                    throw new Error "Error data is not defined!"
            else
                @model.set "errorText", "ERROR"

            @$el.show("slow")

        hide: ->
            @$el.hide()

        onClose: ->
            @modelBinder.unbind()
            delete @modelBinder

    return InputError
