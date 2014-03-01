define [
    "marionette"
    "baseControl"
    "baseControlWrapper"
], (Marionette, BaseControl, BaseControlWrapper) ->

    FilterListButtonItemView = BaseControlWrapper.extend
        className: 'filterListButton__item'
        tagName: 'li'

    FilterListButtonCollectionView = Marionette.CollectionView.extend
        className: 'filterListButton__wrapper'
        itemView: FilterListButtonItemView
        tagName: 'ul'

    return FilterListButton = BaseControl.extend
        className: ->
            @defaultClassName("bFilterListButton")

        initialize: (options) ->
            @model = options.model
            @filterTableMediator = @getFilterTableMediator()
            @listenToOnce(@filterTableMediator, "setTableCollection", @showFilterIfDataExtist)
            @creatListButton()

        creatListButton: ->
            @filterListButtonCollectionView = new FilterListButtonCollectionView
                collection: @prepareItems()
                itemViewOptions : {
                    context: @
                }

        getFilterTableMediator:->
            return @options.context.filterTableMediator

        prepareItems: ->
            items = @model.get('items')
            items.each (itemModel, i) =>
                itemModel.set("context", @model.get('context'))
                itemModel.set("controlType", "filterButton")
                itemModel.set("filterDeclarationIndex", i)
                itemModel.set("filterConfig", itemModel.get('filterConfig'))
            return items

        showFilterIfDataExtist: ->
            if @filterTableMediator.model.get('originTableCollection').length
                @$el.html( @filterListButtonCollectionView.render().el ) 




