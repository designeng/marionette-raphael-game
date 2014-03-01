define [
    "backbone"
    "marionette"
    "baseActiveKey"
    "comboboxListCollection"
    "controls/dropdownlist/list/item/listItemView"
    "controls/dropdownlist/list/noitems/noItemsView"
    "controls/dropdownlist/list/controller/listController"
    "controls/dropdownlist/list/keyboard/keyboardService"
    "when"
    "_.str"
    "jquery.ScrollTo"
], (Backbone, Marionette, BaseActiveKey, ComboboxListCollection, ListItemView, NoItemsView, ListController, KeyboardService, When) -> 
    
    # TODO: to think:
    # this collection must be always ComboboxListCollection instance, collection prototype name must be something as "dropdownListCollection"
    # As the matter of fact, there no private collection can be at all - all them we recieve from combobox control (controller)

    # warning: some this key methods moved to bindKeyMethods requirejs module
    # pass object for extention action in BaseActiveKey
    ListCompositeView = BaseActiveKey({BaseObject: Marionette.CompositeView}).extend

        tagName: "ul"

        itemView: ListItemView

        emptyView: NoItemsView

        className: ->
            @defaultClassName("dropDownList")

        initialize: (options) ->
            @context = @model.get "context"

            # use it only for intersection with DropDownListView:
            @eventBus = Marionette.getOption @, "eventBus"
            @_modelIndex = 0

            @renderDefer = When.defer()

            @applyModelProperties(
                ["width"
                "itemHeight"
                "listHeight" 
                "defaultMaxItemsToShow"
                "itemOverClass"
                "firstVisible"
                "itemClassName"
                "noItemsMessage"],
                        {prefix: @_attrPrefix})

            unless @collection
                @collection = new ComboboxListCollection() # at case of empty collection emptyView will be shown

            # main list controller
            @controller = new ListController
                eventBus: @eventBus
                rootElement: @$el
                highLightClass: @_itemOverClass
                itemHeight: @_itemHeight
                defaultMaxItemsToShow: @_defaultMaxItemsToShow
                firstVisible: @_firstVisible
                collectionProvider: @

            # events for keyboard activity
            @keyEvents = Marionette.getOption @, "keyEvents"

            @keyboardService = new KeyboardService()

            # @keyEvents will be passed here as this.property
            @keyboardService.extendWithKeyMethods.call @

            @_removers = @keyboardService.bindMethodsToEvents.call @
            
            # @see Marionette.collectionView documentation
            # interacting with itemview event
            _.bindAll @, 
                "onListItemOver"
                "onListItemClick"
                "onActiveCurrent"
                "onActiveEnter"       

            @on "itemview:over", @onListItemOver
            @on "itemview:selected", @onListItemClick

            @eventBus.on "range:active:enter", @onActiveEnter
            @eventBus.on "range:active:current", @onActiveCurrent

        onActiveEnter: (index) ->
            try
                @eventBus.trigger "dropdownlist:enter", @.findByIndex(index).model
            catch err
                # nothing

        onActiveCurrent: (index) ->
            try
                @eventBus.trigger "dropdownlist:current", @.findByIndex(index).model
            catch err
                # nothing

        # will be called when "before:item:added" event will be triggered
        # @see marionette.collectionview documentation
        onBeforeItemAdded: (view) ->
            view.eventBus = @eventBus
            @_setProperties(view.model, ["itemHeight", "itemClassName", "modelIndex"])
            @_modelIndex++

        onListItemOver: (itemview) ->
            index = itemview.model.get "modelIndex"

            @eventBus.trigger "dropdownlist:current", itemview.model

            @eventBus.trigger "list:item:over", index

        onListItemClick: (itemview) ->
            @eventBus.trigger "dropdownlist:click", itemview.model

        # @see DropDownService for onBeforeRenderRealised implementation for triggerMethod "before:render:realised" event
        onRender: ->
            @triggerMethod "before:render:realised"

            unless @collection.isEmpty()

                # TODO: _recalculateDisplayParams ? - to remove ?
                @_recalculateDisplayParams()

                @_correctOverFlow()

                @setHeight @_listHeight

                @eventBus.trigger ""

            @emptyView.eventBus = @eventBus

            @renderDefer.resolve(@)

        # we need to know the moment when we can work with rendered view
        # @see listController for this promise usage
        renderPromiseResolved: ->
            return @renderDefer.promise
        
        setHeight: (h) ->
            # to trigger controller "heightWatchStream" eventStream
            @controller.trigger "height:set", h

        setDefaultMaxItemsToShow: (count) ->
            @controller.setDefaultMaxItemsToShow count

        # TODO: move to heightWService
        _recalculateDisplayParams: ->

            if @_defaultMaxItemsToShow > @getCollectionLength() or !@_defaultMaxItemsToShow
                @_defaultMaxItemsToShow = @getCollectionLength()

            @_listHeight = @_defaultMaxItemsToShow * @_itemHeight
            @_currentHeight = @_listHeight

            @eventBus.trigger "width", @_width

        _correctOverFlow: ->
            h = @._itemHeight * @.collection.length
            if h > @._listHeight 
                @.$el.css "overflow-y", "scroll"
            if h < @._listHeight
                @.$el.css "height", h + "px"
            else
                @.$el.css "height", @._listHeight + "px"

        onShow: ->
            @_modelIndex = 0
            @keyboardService.bindEvents.call @

        findByIndex: (index) ->
            return @children.findByIndex(index)

        # to use in scrillingService request
        getItem: (index) ->
            return @children.findByIndex(index)

        # collection api

        getCollectionLength: ->
            return @collection.length

        getCollectionStream: ->
            return @collection.getCollectionStream()

        addItemToCollection: (model) ->
            @collection.add model

        # collection will be croped from 0 to itemsCount
        cropCollection: (itemsCount) ->
            _collection = new ComboboxListCollection()
            for index in [0...itemsCount]
                _collection.add @collection.shift()
            @collection = _collection

        resetCollection: ->
            @collection = new ComboboxListCollection()

        # / collection api

        setMaskMode: (mode) ->
            @eventBus.trigger "mask", mode

        onBeforeClose: ->
            # delete all aspects for current view functions
            for remover in @_removers
                remover.remove()
            delete @_removers

        onClose: ->
            @keyboardService.unBindEvents.call @

        # TODO: move to keyboardService
        _bindKeyEventToMethod: (methodName) ->
            return @[methodName]

        _setProperties: (obj, attrs) ->
            for attr in attrs
                obj.set attr, @[@_attrPrefix + attr]
            return obj

        # overloaded Marionette.CollectionView methods

        showEmptyView: ->
            EmptyView = @getEmptyView()
            if EmptyView and not @_showingEmptyView
                @_showingEmptyView = true
                model = new Backbone.Model(
                       noItemsMessage: @prepareLocalized(@_noItemsMessage, "string")
                    )
                @addItemView model, EmptyView, 0

        # we need wrap itemView.el in tag "li" if it has not "li" as tagName
        appendHtml: (collectionView, itemView, index) ->
            if itemView.tagName != "li"
                collectionView.$el.append($("<li></li>").html(itemView.el))
            else
                collectionView.$el.append itemView.el

        # / overloaded Marionette.CollectionView methods

    return ListCompositeView
