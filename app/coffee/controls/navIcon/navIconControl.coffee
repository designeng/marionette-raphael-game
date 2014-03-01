define ["marionette", "baseControlWrapper"], (Marionette, BaseControlWrapper) ->

    NavIconItemView = BaseControlWrapper.extend
        tagName: "li"

    NavIconViewCollectionView = Marionette.CollectionView.extend
        tagName: "ul"
        itemView: NavIconItemView

    NavIconControlView = Marionette.Layout.extend
        className: ->
            return @model.get "className" if @model

        initialize: (options) ->
            # share current context with collection view items
            @context = Marionette.getOption @, "context"

            # TODO: move context to options!!!!
            @model.get("items").each (model) =>
                model.set "context", @context

            @navIconViewCollectionView = new NavIconViewCollectionView
                collection: @model.get "items"

        onRender: ->
            @$el.html @navIconViewCollectionView.render().el


    return NavIconControlView