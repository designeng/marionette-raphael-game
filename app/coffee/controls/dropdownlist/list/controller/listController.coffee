define [
    "backbone"
    "marionette"
    "when"
    "controls/dropdownlist/list/range/rangeService"
    "controls/dropdownlist/list/scrolling/scrollingService"
    "controls/dropdownlist/list/watcher/heightWatcherService"
    "controls/dropdownlist/list/highlight/highLightService"
], (Backbone, Marionette, When, RangeService, ScrollingService, HeightWatcherService, HighLightService) ->
    
    ListController = Marionette.Controller.extend

        initialize: ->
            @eventBus = Marionette.getOption @, "eventBus"
            @rootElement = Marionette.getOption @, "rootElement"
            @itemHeight = Marionette.getOption @, "itemHeight"

            @firstVisible = Marionette.getOption @, "firstVisible"
            @defaultMaxItemsToShow  = Marionette.getOption @, "defaultMaxItemsToShow"

            # initially items count must be defaultMaxItemsToShow
            @setItemsToShow(@defaultMaxItemsToShow)

            @collectionProvider = Marionette.getOption @, "collectionProvider"
            @highLightClass = Marionette.getOption @, "highLightClass"

            _.bindAll @, 
                "passThroughVisibleItemsCountCalculation"
                "takeHeightWatchObject"
                "completeHeightWatchObject"

                "onUp"
                "onDown"
                "onHome"
                "onEnd"
                "onPageUp"
                "onPageDown"
                "onEnter"
                "onTab"

                # mapping methods:
                "decrease"
                "increase"
                "home"
                "end"
                "pageUp"
                "pageDown"
                "enter"

            @eventBus.on "key:up", @onUp
            @eventBus.on "key:down", @onDown
            @eventBus.on "key:home", @onHome
            @eventBus.on "key:end", @onEnd
            @eventBus.on "key:pageup", @onPageUp
            @eventBus.on "key:pagedown", @onPageDown
            @eventBus.on "key:enter", @onEnter
            @eventBus.on "key:tab", @onTab

            # heightWatchStream is used in HeightWatcherService
            # @see HeightWatcherService
            @heightWatchStream = @.asEventStream("height:set")
                .map(@passThroughVisibleItemsCountCalculation)
                .map(@takeHeightWatchObject)
                .map(@completeHeightWatchObject)

            @collectionStream = @collectionProvider.getCollectionStream()

            @scrollingService = new ScrollingService
                eventBus: @eventBus
                rangeProvider: @

            # init RangeService

            @rangeService = new RangeService
                eventBus: @eventBus
                collectionProvider: @collectionProvider
                itemsToShow: @getItemsToShow()

            if !@firstVisible
                @firstVisible = 0
            else if @firstVisible > lastIndex = @collectionProvider.getCollectionLength() - 1
                @firstVisible = lastIndex

            @rangeService.setActive @firstVisible

            # /init RangeService

            @heightWatcherService = new HeightWatcherService
                eventBus: @eventBus
                rootElement: @rootElement
                itemHeight: @itemHeight

                # and event streams:
                collectionStream: @collectionStream
                heightWatchStream: @heightWatchStream

            @activeDecreaseStream = @.asEventStream("active:decrease")
                .map @decrease

            @activeIncreaseStream = @.asEventStream("active:increase")
                .map @increase

            @activeHomeStream = @.asEventStream("active:home")
                .map @home

            @activeEndStream = @.asEventStream("active:end")
                .map @end

            @activePageUpStream = @.asEventStream("active:pageup")
                .map @pageUp

            @activePageDownStream = @.asEventStream("active:pagedown")
                .map @pageDown

            @activeEnterStream = @.asEventStream("active:enter")
                .map @enter

            # TODO: is it usefull?
            @activeAll = Bacon.mergeAll(@activeDecreaseStream, @activeIncreaseStream, @activeHomeStream, @activeEndStream, @activePageUpStream, @activePageDownStream, @activeEnterStream).toProperty()

            @activeAll.onValue (index) =>
                @eventBus.trigger "range:active:current", index

            # highLightService depends on itemsProvider children (all items must be rendered! - it guarantees itemsProvider.children.length not to be 0)
            # @collectionProvider here is ListCompositeView instance
            When(@collectionProvider.renderPromiseResolved()).then (val) =>
                @highLightService = new HighLightService
                    eventBus: @eventBus
                    highLightClass: @highLightClass
                    activeStream: @rangeService.getActiveStream()

                    itemsProvider: @collectionProvider                

                # and for appropriate scrolling itemsProvider must be settled first
                @scrollingService.setItemsProvider(@collectionProvider).then (val) =>
                    @rangeService.greenRoad.resolve()             

        # this.heightWatchStream workflow methods
        # @see heightWatchStream
        passThroughVisibleItemsCountCalculation: (height) ->
            # it will be used as range in range service!
            itemsCount = @calculateItemsCount(height)

            if itemsCount < @defaultMaxItemsToShow
                @setItemsToShow itemsCount
            else
                @setItemsToShow @defaultMaxItemsToShow

            # difference between first and last, though, will be itemsCount-1
            # and here we can influence on last pointer of rangeService
            @rangeService.correctLast(itemsCount - 1)

            return itemsCount

        takeHeightWatchObject: (itemsCount) ->
            # heightWatchObject initiation
            heightWatchObject = 
                itemsCount: itemsCount
                itemHeight: @itemHeight
                maxItemsToShow: @getItemsToShow()

            return heightWatchObject

        completeHeightWatchObject: (heightWatchObject) ->
            # complete heightWatchObject with first and last fields
            heightWatchObject.first = @rangeService.getFirst()
            heightWatchObject.last = @rangeService.getLast()

            return heightWatchObject

        # key events bindings
        # active is a sort of pointer - so all keyboard events about it
        onUp: ->
            @trigger "active:decrease"

        onDown: ->
            @trigger "active:increase"

        onHome: ->
            @trigger "active:home"

        onEnd: ->
            @trigger "active:end"

        onPageUp: ->
            @trigger "active:pageup"

        onPageDown: ->
            @trigger "active:pagedown"

        onEnter: ->
            @trigger "active:enter"

        onTab: ->
            @trigger "active:enter"

        # /key events bindings

        # eventstreams mapping functions
        decrease: ->
            @rangeService.activeMinus()

        increase: ->
            @rangeService.activePlus()

        home: ->
            @rangeService.activeHome()

        end: ->
            @rangeService.activeEnd()

        pageUp: ->
            @rangeService.activePageUp()

        pageDown: ->
            @rangeService.activePageDown()

        enter: ->
            @rangeService.activeEnter()

        # /eventstreams mapping functions

        calculateItemsCount: (h) ->
            tail = h % @itemHeight
            if h - tail == 0
                # at least 1 item must be shown in dropdown
                return 1
            else
                return (h - tail) / @itemHeight

        setItemsToShow: (count) ->
            @itemsToShow = count

        getItemsToShow: ->
            return @itemsToShow