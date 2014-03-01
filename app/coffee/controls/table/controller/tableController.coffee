define [
    "backbone"
    "marionette"
], (Backbone
    Marionette
    ) -> 
    
    TableController = Marionette.Controller.extend

        _currentSortingObj: {}

        _currentSortingDirection: []

        initialize: ->
            @collection = Marionette.getOption @, "collection"
            if !@collection
                @collection = new Backbone.Collection()
            @collectionStrategy = Marionette.getOption @, "collectionStrategy"
            @collection = _.extend @collection, @collectionStrategy

        addItemToCollection: (item) ->
            @collection.push item

            attrName = @_currentSortingObj.name
            i = @_currentSortingObj.i
            @collection.sortByAttr(attrName, @_currentSortingDirection[i])

            @collection.trigger "reset"

        defineSortDirection: (i, actual) ->
            if actual
                @_currentSortingDirection[i] = -1
            else 
                @_currentSortingDirection[i] = 0


        sort: (attrName, i) ->
            @_currentSortingObj.name = attrName
            @_currentSortingObj.i = i

            @_currentSortingDirection[i] *= -1
            @collection.sortByAttr(attrName, @_currentSortingDirection[i])

            @collection.trigger "reset"

        getDirection: (i) ->
            return @_currentSortingDirection[i]

        setCollection: (collection) ->
            @collection = collection
            @collection = _.extend @collection, @collectionStrategy

        getCollection: (collection) ->
            return @collection