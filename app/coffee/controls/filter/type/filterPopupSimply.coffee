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
            $('.filterMenuWrapper__content', @$el).addClass('scroll') if @filterItems.collection.length > 5
            $('.filterMenuWrapper__content', @$el).html @filterItems.render().el

        onBeforeRender: ->
            @template = @model.get('tpl')

        initialize: ->
            @filterTableMediator = @getFilterTableMediator()
            @filterItems = @creatFilterItems()

        getFilterTableMediator: ->
            return @getPopupContext().filterTableMediator

        getPopup: ->
            return @options.context.options.context

        getFilterField:->
            return @getPopupContext().model.get('filterConfig').param.filterField

        getPopupContext: ->
            return @getPopup().model.get('context')

        closePopup: ->
            @getPopup().closePopup()

        creatFilterItems: ->
            return filterWrapperContentCollectionView = new FilterWrapperContentCollectionView
                collection      : @filterTableMediator.getFilterCollectionByField( @getFilterField() )
                itemViewOptions : {
                    filterTableMediator: @filterTableMediator
                    fieldIndex: @getPopupContext().model.get('filterDeclarationIndex')
                    fieldName: @getFilterField()
                }





