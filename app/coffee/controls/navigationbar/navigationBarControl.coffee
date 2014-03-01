define [
    "marionette"
    "baseControl"
    "baseControlWrapper"
], (Marionette, BaseControl, BaseControlWrapper) ->

    NavigationCollectionItemView = BaseControlWrapper.extend
        tagName: "li"

    NavigationCollectionView = Marionette.CollectionView.extend
        itemView: NavigationCollectionItemView
        tagName: "ul"

    return NavigationView =  BaseControl.extend
        className: ->
            @defaultClassName("navigationBarControl")

        initialize: (options) ->
            @context = Marionette.getOption @, "context"

            @applyModelProperties([
                "items"
                "controlType"
            ], {prefix: @_attrPrefix})

            @navigationCollectionView = new NavigationCollectionView
                collection: @prepareItems(@_items, @context, @_controlType)

            _.bindAll @, "onChildControlClick"

            @context.on "childControl:click", @onChildControlClick

        prepareItems: (items, context, controlType) ->
            items.each (itemModel) ->
                itemModel.set("context", context)
                itemModel.set("controlType", "linkControl") unless controlType   # default controlType
            return items

        onChildControlClick: (eData) ->
            @model.set "_currentActiveModel", eData.model

        onRender: ->
            @$el.html @navigationCollectionView.render().el
