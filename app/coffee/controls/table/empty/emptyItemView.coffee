define [
    "backbone"
    "marionette"
], (Backbone, Marionette) -> 

    EmptyItemView = Marionette.ItemView.extend
        template: "<td> No items </td>"
        tagName: "tr"
        initialize: ->
            @applyOptions([
                "columns"
                "itemHeight"
            ])
        onRender: ->
            @setHeight @itemHeight if @itemHeight

        setHeight: (h) ->
            @$el.css "height", h