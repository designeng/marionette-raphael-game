define [
    "underscore"
    "marionette"
    "baseControl"
    "baseControlWrapper"
], (_, Marionette, BaseControl, BaseControlWrapper) ->


    FilterWrapperContentItemView = BaseControlWrapper.extend
        template: "<div class='filterMenu__itemButton'><span class='filterMenu__itemText'>{{ link }}</span><span class='filterMenu__itemArrow'></span></div>"
        events  : "click .filterMenu__itemText" : "onClick"
        tagName : 'li'

        className: ->
            tagClass = 'filterMenu__item'
            if @options.filterTableMediator.getFilterByParam( @options.fieldName, @options.fieldIndex, @model.get('link') ).length
                tagClass = 'filterMenu__item selected'
            return tagClass

        onClick: (e) ->
            vauleText = $(e.target)
                .closest('.filterMenu__item')
                .toggleClass('selected')
            @options
                .filterTableMediator
                .toggleFilter( @options.fieldName, @options.fieldIndex, $(e.target).text() )


    FilterWrapperContentCollectionView = Marionette.CollectionView.extend
        itemView : FilterWrapperContentItemView
        className: 'filterMenu'
        tagName  : 'ul'

        initialize: ->
            @itemViewOptions = @options.itemViewOptions


    return FilterWrapperContent = BaseControl.extend
        events: 'click .buttonControl': 'closePopup'

        onRender: ->
            conunter = 0
            $('.filterMenuWrapper__content', @$el).html('')
            for item in @filterItems 
                $('.filterMenuWrapper__content', @$el)
                    .append('<h2 class="filterMenuWrapper__contentTitle">'+item.title+'</h2>')
                    .append(item.collection.render().el)
                conunter += item.collection.collection.length

            $('.filterMenuWrapper__content', @$el).addClass('scroll') if conunter > 5

        onBeforeRender: ->
            @template = @model.get('tpl')

        initialize: ->
            @filterTableMediator = @getFilterTableMediator()
            @filterItems = @creatFilterItems( @getFilterItems() )

        getFilterTableMediator: ->
            return @getPopupContext().filterTableMediator

        getFilterItems: ->
            return @getPopupContext().model.get('filterConfig').param.filterItems

        getPopupContext: ->
            return @getPopup().model.get('context')

        getPopup: ->
            return @options.context.options.context

        closePopup: ->
            @getPopup().closePopup()

        creatFilterItems: (aItems)  -> 
            if aItems.length 
                for filteItem in aItems
                    filteItem.collection = @creatCollectionFilterItem(filteItem)
            return aItems

        creatCollectionFilterItem: (item) ->
            return collectionView = new FilterWrapperContentCollectionView
                collection      : @filterTableMediator.getFilterCollectionByField( item.field )
                itemViewOptions : {
                    fieldName           : item.field
                    fieldIndex          : @getPopupContext().model.get('filterDeclarationIndex')
                    filterTableMediator : @filterTableMediator
                }



