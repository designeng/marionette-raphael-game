define [
    "backbone"
    "marionette"
    "bacon"
    "eventstreams"
], (Backbone, Marionette, Bacon) ->

    InfoItemView = Marionette.ItemView.extend
        tagName: "li"

        template: "{{value}}"  

    InfoViewCollection = Backbone.Collection.extend
        initialize: ->
            @collectionStream = @asEventStream("add remove reset change noitems").map(this).toProperty()    

        getCollectionStream: ->
            return @collectionStream

    InfoView = Marionette.CollectionView.extend
        className: ->
            @defaultClassName "infoControl"

        tagName: "ul"

        itemView: InfoItemView

        initialize: ->
            # cases showld be an array
            @applyModelProperties([
                "cases"
            ], {prefix: @_attrPrefix})

            @collection = new InfoViewCollection() unless @collection
            @toCollection @_cases
            @localizeCollection()

            @reservedCollection = @collection.clone()

            @collectionStream = @collection.getCollectionStream()

            @setCollectionStream()

        setCollectionStream: ->
            @collectionStream = @collection.getCollectionStream()

            @collectionStream.onValue (val) =>
                @render()

        # @param {Array} items
        toCollection: (items) ->
            _.each items, (item) =>
                keys = _.keys item
                fieldName = keys[0]
                fieldValue = item[fieldName]

                @collection.add(new Backbone.Model
                    key: fieldName
                    value: fieldValue
                )

        localizeCollection: () ->
            @collection.each (model) =>
                value = model.get "value"
                localizedValue = @prepareLocalized value, "string"
                model.set "value", localizedValue

        # choose model from collection by "key" property
        chooseModelByKey: (collection, key) ->
            return collection.where({key: key})

        # to choose from model fields, what field (field value) will be shown.

        # @param {String|Array} infoCases
        setInfoCases: (infoCases) ->
            _collection = @collection.clone()

            # reset collection
            @collection = new InfoViewCollection()
            @setCollectionStream()

            if _.isString infoCases
                model = @chooseModelByKey(_collection, infoCases)
                @collection.add model
            else if _.isArray infoCases
                if infoCases.length != 0
                    for item in infoCases
                        model = @chooseModelByKey(_collection, item)
                        @collection.add model
                # infoCases is empty array
                else
                    @collection.trigger "noitems"

        # public api provider
        publicApi: () ->
            return {
                "setInfoCases": @setInfoCases
            }

    return InfoView

