define ["backbone"
        "marionette"
        "baseControl"
        "when"
], (Backbone, Marionette, BaseControl, When) ->

    ButtonView = BaseControl.extend

        tagName: "input"

        className: ->
            @defaultClassName("button")

        events: {
            "mouseover" : "onMouseOver"
            "mouseout"  : "onMouseOut"
            "click"     : "onClick"
            "focus"     : "onFocus"
            "blur"      : "onBlur"
        }

        modelEvents:
            "change:disabled": "onDisabledChange"

        initialize: (options) ->
            @context = Marionette.getOption @, "context"

            @applyModelProperties([
                        "states"
                        "callback"
                        "timeout"
                        "caption"
                        "triggerEvent"
                    ], {prefix: @_attrPrefix})

            # not sure to call directly context method
            if @context && @context["validate"]
                _.result @context["validate"]

            if @model.get "disabled"
                @disabled = true
                @$el.addClass @_states["disabled"]["className"]
                @$el.attr("disabled", "disabled")

            @$el.attr "type", "button"

        onRender: -> 
            # result as string
            @_captionPrepared = @prepareLocalized(@_caption, "string")
            if _.isArray @_captionPrepared
                @_captionPrepared = @_captionPrepared[0]

            @$el.attr "value", @_captionPrepared

        onFocus: ->
            @$el.addClass('focus')

        onBlur: ->
            @$el.removeClass('focus')

        onDisabledChange: ->
            @disabled = !@disabled
            if !@disabled
                @$el.removeClass @_states["disabled"]["className"]
                @$el.removeAttr("disabled", "disabled")
            else                                                            #button is disabled, really
                @$el.addClass @_states["disabled"]["className"]
                @$el.attr("disabled", "disabled")

        # setters
        setActive:(state) ->
            if !state
                @model.set "disabled", true
            else if !!state == true
                @model.set "disabled", false

        # hover state
        onMouseOver: (event) ->
            if @disabled
                return
            @$el.addClass @_states["hover"]["className"]

        # out - not state, but we must return to default
        onMouseOut: (event) ->
            if @disabled
                return
            for state in ["hover", "active"]
                @$el.removeClass @_states[state]["className"]

        onClick: (e) ->
            if @disabled
                e.preventDefault()
                return
            else
                @setActive(false)

                if @_triggerEvent
                    @context.trigger @_triggerEvent
                # obviously if @_callback is defined - this button not belongs to form - form must define controller in componentModel, not simple callback
                if @_callback
                    _.result @, "callback"
                    e.preventDefault()
                    return  

                # @setActive(true) 

            e.preventDefault()

        # public api provider
        publicApi: () ->
            return {
                "setActive": @setActive
            }




