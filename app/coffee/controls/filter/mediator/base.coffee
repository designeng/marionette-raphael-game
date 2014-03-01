define [
    "underscore"
    "backbone"
    "marionette"
], (_, Backbone, Marionette) -> 

    FilterModel =  Backbone.Model.extend
        fieldName   : undefined
        fieldIndex  : undefined
        value       : undefined

    FilterCollection = Backbone.Collection.extend
        model: FilterModel

    filtedDataModel =  new Backbone.Model
        filterCollection        : new FilterCollection
        tableCollection         : undefined
        originTableCollection   : undefined

    return FilterSortTableMediator = Marionette.Controller.extend
        initialize: ->
            @model = filtedDataModel
            @listenToOnce(@model, "change:tableCollection", @createOriginTableData)

        toggleFilter: (fieldName, fieldIndex, filterValue) ->
            if @getFilterByParam(fieldName, fieldIndex, filterValue).length
                @removeFilter(fieldName, fieldIndex, filterValue)
            else 
                @addFilter(fieldName, fieldIndex, filterValue)
            @applyfilterToTable()

        addFilter: (fieldName, fieldIndex, filterValue) ->
            @model.get('filterCollection').add([{ fieldName:fieldName, fieldIndex:fieldIndex, value:filterValue }])

        removeFilter: (fieldName, fieldIndex, filterValue) ->
            aModel = @getFilterByParam(fieldName, fieldIndex, filterValue)
            for model in aModel
                @model.get('filterCollection').remove(model)

        setTableCollection: (collection) ->
            @model.set('filterCollection', new FilterCollection)
            @model.set('originTableCollection', undefined)
            @model.set('tableCollection', collection)
            @createOriginTableData()
            @trigger('setTableCollection')

        getFilterByParam: (fieldName, fieldIndex, filterValue) ->
            return  @model.get('filterCollection').where({ fieldName:fieldName, fieldIndex:fieldIndex, value:filterValue })

        getFilterByFieldIndex: (fieldIndex) ->
            return  @model.get('filterCollection').where({ fieldIndex:fieldIndex })

        getFilterCollectionByField: (filterField) ->
            itemCollection = new Backbone.Collection
            for model in @model.get('originTableCollection').models                     # grouping items
                if typeof model isnt 'undefined'
                    itemsData = itemsData || {}
                    itemsData[model.get(filterField)] = model.get(filterField)

            itemCollection = new Backbone.Collection

            for item of itemsData                                                       # create filter collection
                itemObj = itemObj || {}
                itemObj['link'] = item
                itemCollection.add(itemObj)
            return itemCollection

        createOriginTableData: ->
            tableCollection = @model.get('tableCollection')
            @model.set 'originTableCollection', @cloneCollection(tableCollection)

        cloneCollection: (collection) ->
            clonedCollection = new Backbone.Collection()
            collection.each (collectionModel) ->
                clonedCollection.add(new Backbone.Model(collectionModel.toJSON()))
            return clonedCollection

        applyfilterToTable: ->
            filteringCollection = @cloneCollection( @model.get('originTableCollection') ).models
            if @model.get('filterCollection').length 
                filteringCollection = @filteringCollectionByValue(filteringCollection, @getAllFilterValues())
            @model.get('tableCollection').reset(filteringCollection)

        filteringCollectionByValue: (collection, filterValues) ->
            return collection.filter (model) ->
                return _.any model.attributes, (val, attr) ->
                    for value in filterValues
                        if value is val
                            return true

        dropAllFiltersByFieldIndex: (fieldIndex) ->
            aModel = @getFilterByFieldIndex( fieldIndex )
            for model in aModel
                @model.get('filterCollection').remove(model)
            @applyfilterToTable()


        getAllFilterValues: ->
            values = []
            @model.get('filterCollection').each (model) ->
                values.push(model.get('value'))
            return values


