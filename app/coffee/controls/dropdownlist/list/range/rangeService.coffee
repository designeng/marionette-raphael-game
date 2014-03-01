define [
    "marionette"
    "when"
], (Marionette, When) ->
    # model for list range state watching

    FirstActiveLast = Backbone.Model.extend
        initialize: ->
            @changed  = @asEventStream("add change").map(this).toProperty()

            @active   = @changed.map () => @.get("active")

            @active.onValue (v) =>
                @_active = v

        setFirst: (val) ->
            @set "first", val
        setActive: (val) ->
            @set "active", val
        setLast: (val) ->
            @set "last", val

        getFirst: ->
            @get "first"
        getActive: ->
            @get "active"
        getLast: ->
            @get "last"

    RangeService = Marionette.Controller.extend
        initialize: ->
            @eventBus = Marionette.getOption @, "eventBus"
            @collectionProvider = Marionette.getOption @, "collectionProvider"
            @itemsToShow = Marionette.getOption @, "itemsToShow"

            # defer object - "green road" for scrolling etc.
            @greenRoad = When.defer()

            @falst = new FirstActiveLast()

            # model's active stream
            # here we must correct first and last pointers
            # (active always between 0 and @getLastIndex() yet!)
            @falst.active.onValue (active) =>
                range = @getRange()
                first = @getFirst()
                last = @getLast()

                if first == undefined or last == undefined
                    @setFirst 0
                    @setLast @itemsToShow
                    # it must be first time we show list, so
                    return

                # TODO: somewhere about a bug (browser falls...) !!!!! (important)
                # when height is less then one item height

                # active out of range
                if active > last
                    @setLast(last + range)
                    @setFirst(last)
                    @eventBus.trigger "mask:show"

                    When(@greenRoadResolved()).then (v) =>
                        @eventBus.trigger "scroll:to", active

                    return
                if active < first
                    @setFirst active
                    @setLast(active + range)
                    @eventBus.trigger "mask:show"
                    
                    When(@greenRoadResolved()).then (v) =>
                        @eventBus.trigger "scroll:to", active

                    return

            _.bindAll @, "setActive"
            @eventBus.on "list:item:over", @setActive

        setFirst: (index) ->
            @falst.setFirst index
        setLast: (index) ->
            @falst.setLast index
        setActive: (index) ->
            @falst.setActive index

        getFirst: ->
            @falst.getFirst()
        getLast: ->
            @falst.getLast()
        getActive: ->
            @falst.getActive()

        # event stream
        # @returns {Number} active stream from FirstActiveLast model
        getActiveStream: ->
            @falst.active

        # report about active after enter pressed!
        activeEnter: ->
            active = @getActive()
            @eventBus.trigger "range:active:enter", active
            return active

        activeMinus: ->
            if @getActive() > 0
                @setActive(@getActive() - 1)
            return @getActive()

        activePlus: ->
            if @getActive() < @getLastIndex()
                @setActive(@getActive() + 1)
            return @getActive()

        activePageUp: ->
            range = @getRange()
            active = @getActive() - range

            if active > 0
                @setActive(active)
            else
                @setActive 0
            
            return @getActive()

        activePageDown: ->
            range = @getRange()
            active = @getActive() + range
            if active < @getLastIndex()
                @setActive(active)
            else 
                @setActive @getLastIndex()

            return @getActive()

        activeHome: ->
            @setActive(0)
            return 0

        activeEnd: ->
            @setActive(@getLastIndex())
            return @getActive()

        getRange: ->
            range = @getLast() - @getFirst()
            return range

        getLastIndex: ->
            return @collectionProvider.getCollectionLength() - 1

        correctLast: (range) ->
            @setLast(@getFirst() + range)

        greenRoadResolved: ->
            return @greenRoad.promise



