define ["marionette"], (Marionette) ->
    HighLightService = Marionette.Controller.extend
        indexHighLighted: -1

        initialize: ->
            @eventBus = Marionette.getOption @, "eventBus"

            @highLightClass = Marionette.getOption @, "highLightClass"
            @activeStream = Marionette.getOption @, "activeStream"

            @itemsProvider = Marionette.getOption @, "itemsProvider"

            @activeStream.onValue (active) =>
                @highLight active

        # Function to highlight item when apropriate event catched
        # @param {Number} index Item index
        highLight: (index) ->
            item = @getItemByIndex(index)

            try
                # un-highlight prev
                if @indexHighLighted >= 0
                    @unHighLight @indexHighLighted

                # highlight current
                item.highLight @highLightClass

                @indexHighLighted = index
            catch err
                console.log "Something wrong... may be " + item + " with index " + index + " and class " + _.result(item, "className") + " has not method highLight"

        # Function to clear highlighting in highlighted item
        # @param {Number} index Item index
        unHighLight: (index) ->
            @getItemByIndex(index).unHighLight @highLightClass

        getItemByIndex: (index) ->
            try
                item = @itemsProvider.getItem(index)
                return item
            catch e
                return null

        setIndexHighLighted: (index) ->
            @indexHighLighted = index