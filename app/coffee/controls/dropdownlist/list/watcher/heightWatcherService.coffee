define ["marionette"], (Marionette) ->
    
    HeightWatcherService = Marionette.Controller.extend

        collectionLength: 0

        initialize: ->
            # element in target view to set height
            @rootElement = Marionette.getOption @, "rootElement"
            @eventBus = Marionette.getOption @, "eventBus"

            # streams
            # heightWatchStream used for calculating real height of element - it must be divisible by itemsCount
            @heightWatchStream = Marionette.getOption @, "heightWatchStream"
            # collectionStream used for getting current collectionLength
            @collectionStream = Marionette.getOption @, "collectionStream"

            @collectionStream.onValue (val) =>
                @collectionLength = val.length

            @heightWatchStream
                .onValue (heightWatchObject) =>
                    @correctHeight(heightWatchObject)

        correctHeight: (heightWatchObject) ->
            count = heightWatchObject.itemsCount
            itemHeight = heightWatchObject.itemHeight
            maxItemsToShow = heightWatchObject.maxItemsToShow

            if maxItemsToShow and count > maxItemsToShow
                itemsToShow = maxItemsToShow
            else if count > @collectionLength
                itemsToShow = @collectionLength
            else
                itemsToShow = count

            height = itemsToShow * itemHeight
            @setHeight height

            # send event to the control root to set mask height
            @eventBus.trigger "mask:height", height

        setHeight: (h) ->
            @rootElement.css "height", h


