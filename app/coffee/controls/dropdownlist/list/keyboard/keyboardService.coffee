define [
    "marionette"
    "_.str"
], (Marionette) ->

    getMethodName = (string) ->
        return "on" + _.str.classify.call(@, string)

    keyFunctions = {
        onEnter: (e) ->
            @eventBus.trigger "key:enter"
            e.preventDefault()
            return "enter"

        onUp: (e) ->
            @eventBus.trigger "key:up"
            e.preventDefault()
            return "up"

        onDown: (e) ->
            @eventBus.trigger "key:down"
            e.preventDefault()
            return "down"

        onHome: (e) ->
            @eventBus.trigger "key:home"
            e.preventDefault()
            e.stopImmediatePropagation()
            return "home"

        onEnd: (e) ->
            @eventBus.trigger "key:end"
            e.preventDefault()
            e.stopImmediatePropagation()
            return "end"

        onPageUp: (e) ->
            @eventBus.trigger "key:pageup"
            e.preventDefault()
            return "page_up"

        onPageDown: (e) ->
            @eventBus.trigger "key:pagedown"
            e.preventDefault()
            return "page_down"

        onTab: (e) ->
            @eventBus.trigger "key:tab"
            e.preventDefault()
            return "tab"
    }

    KeyboardService = Marionette.Controller.extend

        # calls in dropdown in context of dropdown
        extendWithKeyMethods: ->
            keyFunctions.eventBus = @eventBus
            _.extend @, keyFunctions

        # calls in dropdown in context of dropdown
        # all @keyEvents items (keyboard events) will be bound to correspondent methods
        # for ex., "enter" - will be bound to "onEnter" and so on.
        bindEvents: ->
            _.each @keyEvents, (evt) =>         
                @keyOn evt, @_bindKeyEventToMethod(getMethodName evt)

        # calls in dropdown in context of dropdown
        # turn off all key events
        unBindEvents: ->
            _.each @keyEvents, (evt) =>
                @keyOff evt

        bindMethodsToEvents: () ->
            _removers = []
            # create method and reload it afterwords
            for evt in @keyEvents
                methodName = getMethodName evt

                # reserve method for subsequent overloading, if not exists
                if !@[methodName]
                    @[methodName] = (e) =>
                        # blank funcion

            return _removers
