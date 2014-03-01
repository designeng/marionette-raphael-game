define [
    "marionette"
    "baseControlWrapper"
    "buttonControl"
    "buttonModel"
], (Marionette, BaseControlWrapper, ButtonControl, ButtonModel) ->

    # nav items
    NavigationCollectionItemView = BaseControlWrapper.extend
        tagName: "li"
        className: "flightSearchHistory__listItem"
        template: "<div class='flightSearchHistory__listItemClose'></div>"  # template: "<span class='flightSearchHistory__listItemDate'> {{date}} </span>"

        initialize: ->
            BaseControlWrapper::initialize.call @
            @itemModel = Marionette.getOption(@, "model")

        renderInnerControl: (view) -> # TODO BAD
            @$el.append( view.render().el )
            @$el.append('<span class="flightSearchHistory__listItemDate">'+@itemModel.get('date')+'</span>') if @itemModel.get('date')
            @$el.append('<span class="flightSearchHistory__listItemDate">(±1)</span>') if @itemModel.get('plusMinus')


    # nav
    NavigationCollectionView = Marionette.CollectionView.extend
        itemView: NavigationCollectionItemView
        className: "flightSearchHistory__list"
        tagName: "ul"

    # layout
    NavigationLayout =  Marionette.Layout.extend
        className: ->
            return @model.get "className" if @model

        initialize: (options) ->
            @context = Marionette.getOption @, "context"
            @items = @model.get "items"

            @addContextToItems()
            @creatItemsCollection()

        addContextToItems: ->
            @items.each (model) =>
                model.set "context", @context
                model.set("controlType", "linkControl") unless model.has("controlType")   # default controlType

            @context.on "childControl:click", @onChildControlClick

        creatItemsCollection: ->
            elContext = @context
            NavigationCollectionView = NavigationCollectionView.extend
                collection: @items
                onItemRemoved: ->
                    unless @children.length 
                        elContext.trigger('hideFavorite')
            @navigationCollectionView = new NavigationCollectionView

        onChildControlClick: (eData) ->
            @model.set "_currentActiveModel", eData.model

        onRender: ->
            @$el.append( @navigationCollectionView.render().el )

    return NavigationLayout
