define [
    "marionette"
    "baseControl"
    "baseControlWrapper"
    "popupControl"
    "buttonControl"
    "buttonModel"
    "hbs!templates/modules/popup/filterTpl"
], (Marionette, BaseControl, BaseControlWrapper, PopupControl, ButtonControl, ButtonModel, filterTpl) ->


    closeButtonModel = new ButtonModel
        className: "closeButton filter"
        caption: "x"
        states:
            "disabled"  :{}
            "default"   :{}
            "hover"     :{"className": "closeButtonHover"}
            "active"    :{"className": "closeButtonActive"}

    FilterButtonPopupItemView = BaseControlWrapper.extend
        className   : 'filterButtonNav__item'
        template    : '<span class="filterButtonNav__itemText"><span class="filterButtonNav__itemSplit">,</span>{{ value }}</span>'
        tagName     : 'li'
        events      : 'click .filterButtonNav__itemText' : 'onClick'
        onClick: (e) ->
            @options.filterButtonController.showPopup()

    FilterButtonPopupCollectionView = Marionette.CollectionView.extend
        itemView : FilterButtonPopupItemView
        className: 'filterButtonNav'
        tagName  : 'ul'
        events   : 
            'mouseover .closeButton' : 'onCloseHover'
            'mouseout .closeButton' : 'onCloseOut'

        closeButton : closeButtonModel

        initialize: ->
            @itemViewOptions = @options.itemViewOptions
            @filterButtonController = @itemViewOptions.filterButtonController
            @filterTableMediator = @filterButtonController.filterTableMediator
            @initCloseButton()

        initCloseButton: ->
            CloseButton = ButtonControl.extend
                model: Marionette.getOption @, "closeButton"
                onClick: (e) =>
                    @dropFilterButtons()
            @closeButton = new CloseButton

        dropFilterButtons: ->
            filterFieldIndex = @filterButtonController.model.get('filterDeclarationIndex')
            @filterTableMediator.dropAllFiltersByFieldIndex( filterFieldIndex )
            @filterButtonController.fetchFilterButtonPopup()

        onRender: ->
            filterFieldIndex = @filterButtonController.model.get('filterDeclarationIndex')
            filterCount = @filterTableMediator.getFilterByFieldIndex( filterFieldIndex )

            if filterCount.length                                   # if filters selected
                @$el.append @closeButton.render().$el 
                @$el.addClass('filtered')

        onCloseHover: ->
            @$el.addClass('closeHover')

        onCloseOut: ->
            @$el.removeClass('closeHover')


    return filterButtonPopup = BaseControl.extend
        className: ->
            @defaultClassName "filterButton"

        initialize: ->
            @filterConfig = @model.get('filterConfig')
            @maxShowSelectedFilterButtons = 3
            @filterTableMediator = @getFilterTableMediator()
            @fetchFilterButtonPopup(true)
            @listenToOnce(@filterTableMediator, "setTableCollection", @fetchFilterButtonPopup)

        fetchFilterButtonPopup: (noFetch) ->
            @filterButtons = @creatFilterButtonPopupItems()
            @filterButtons.render()
            @$el.html @filterButtons.render().el unless noFetch 

        creatFilterButtonPopupItems: ->
            return filterButtonPopupCollectionView = new FilterButtonPopupCollectionView
                itemViewOptions : { filterButtonController : @ }
                collection      : @getFilterButtonCollection()

        onRender: ->
            @$el.html @filterButtons.render().el

        getFilterButtonCollection: ->
            singlFilterButtonCollection = new Backbone.Collection
            newFilterButtonCollection = @filterTableMediator.cloneCollection( @filterTableMediator.model.get('filterCollection') ) 
            modelsButtonCollection = newFilterButtonCollection.where({ fieldIndex: @model.get('filterDeclarationIndex') })

            if modelsButtonCollection.length
                aAddingModels = []
                modelCounter = 0
                for model in modelsButtonCollection
                    if modelCounter < @maxShowSelectedFilterButtons
                        aAddingModels.push(model)
                        modelCounter++
                return singlFilterButtonCollection.add(aAddingModels)
            else 
                return singlFilterButtonCollection.add({value: @getLocalDefaultTitle() })

        getFilterTableMediator:->
            return @model.get('context').options.context.filterTableMediator

        getLocalDefaultTitle: ->
            loc = @filterConfig.param.filterField
            loc = @filterConfig.param.filterTitle if @filterConfig.param.filterTitle
            return @prepareLocalized(loc, "string")

        showPopup: ->
            unless $(@el).next().length
                @popup = @createPopup()
                @listenTo(@popup, 'popupClose:finish', @fetchFilterButtonPopup)
                @popup.show()

        createPopup: ->
            defaultFilterPopupOptions = {
                className: "popupControl"
                centeringWidthPosition: false
                centeringHeightPosition: false
                borderColor: "black"
                content: @filterConfig.type
                closeButton: false
                mask: false
                context: @
                typeRendering: 'inside' # 'outside'
                wrapperClassName: @cid+'__popupRegion'
                template: filterTpl
                el: $(@el)
            }
            return new PopupControl
                model: new Backbone.Model(_.extend defaultFilterPopupOptions, @model.get('popup'))
