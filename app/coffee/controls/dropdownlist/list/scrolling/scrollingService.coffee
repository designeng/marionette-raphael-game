define [
    "marionette"
    "when"
    "jquery.ScrollTo"
], (Marionette, When) ->

    ScrollingService = Marionette.Controller.extend

        initialize: ->
            @eventBus = Marionette.getOption @, "eventBus"
            @rangeProvider = Marionette.getOption @, "rangeProvider"
            @itemsProvider = Marionette.getOption @, "itemsProvider"

            @itemsProviderCompleted = When.defer()

            _.bindAll @,
                "scrollToIndex"

            @eventBus.on "scroll:to", @scrollToIndex

        setItemsProvider: (object) ->
            @itemsProvider = object
            @itemsProviderCompleted.resolve()
            return @itemsProviderCompleted.promise

        scrollToIndex: (index) ->
            $el = @getElementByIndex index

            @scrollToElement $el

        getElementByIndex: (index) ->
            try
                item = @itemsProvider.getItem(index)
                return item.$el
            catch e
                return null

        scrollToElement: ($el) ->
            $el.ScrollTo
                duration: 0
                callback: =>
                    # reserved for callback logic
                    # console.log "scrolled"   
