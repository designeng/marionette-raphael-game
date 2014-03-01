define [
    "backbone"
    "marionette"
    "when"
    "controls/dropdownlist/list/listCompositeView"
], (Backbone, Marionette, When, ListCompositeView) -> 

    DropDownService = Marionette.Controller.extend
        initialize: ->
            @itemType = Marionette.getOption @, "itemType"

            if @itemType
                @resolveClasses()

            @eventBus = Marionette.getOption @, "eventBus"
            @keyEvents = Marionette.getOption @, "keyEvents"

            @renderDefer = When.defer()

        resolveClasses: ->
            @itemViewClass = require @itemType

        initDropDownView: (options) ->
            @dropDownView = new ListCompositeView(
                            model: options.model
                            collection: options.collection
                            eventBus: @eventBus
                            keyEvents: @keyEvents
                        )
                               
            @dropDownView.itemViewOptions = {
                    eventBus: @eventBus
                }

            @dropDownView.itemView = @itemViewClass

            # we defined this function to return @renderDefer promise resolving
            # @see dropDownView prototype for "before:render:realised" event
            @dropDownView.onBeforeRenderRealised = () =>
                @renderDefer.resolve @dropDownView

        renderInRegion: (region) ->
            @region = region
            @region.show @dropDownView

        closeRegion: () ->
            @region.close()

        promiseRendered: ->
            return @renderDefer.promise

        # proxy
        setHeight: (height) ->            
            @dropDownView.setHeight(height) if @dropDownView

        # proxy
        setDefaultMaxItemsToShow: (count) ->
            @dropDownView.setDefaultMaxItemsToShow(count) if @dropDownView

        # proxy
        addItemToCollection: (model) ->
            @dropDownView.addItemToCollection(model)

        # proxy
        cropCollection: (itemsCount) ->
            @dropDownView.cropCollection(itemsCount)

        # proxy
        resetCollection: ->
            @dropDownView.resetCollection()

        getDropDownView: ->
            return @dropDownView