define [
    "backbone"
    "marionette"
    "controls/table/row/tableRowControl"
    "controls/table/empty/emptyItemView"
], (Backbone, Marionette, TableRowControl, EmptyItemView) -> 

    return TableBodyView = Marionette.CollectionView.extend
        tagName: "tbody"
        itemView: TableRowControl                                       # default itemView; for customisation define itemType for tableControl in declaration
        emptyView: EmptyItemView

        initialize: ->
            @applyOptions([
                "eventBus"
                "collection"
                "itemView"
                "columns"
            ])

        itemViewOptions: (model, index) ->                              # options to pass into itemView instance (tableRowControl, by default)
            return options =
                columns: @columns
                itemHeight: @itemHeight

        onBeforeRender: ->
            return @setHeight @itemHeight

        setHeight: (h) ->
            return @$el.css("height", h)