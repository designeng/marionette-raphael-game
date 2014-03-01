define [
    "backbone"
    "marionette"
], (Backbone,
    Marionette
    ) -> 
    
    TableRowView = Marionette.ItemView.extend

        tagName: "tr"

        initialize: ->
            @_columns = Marionette.getOption @, "columns"
            @_itemHeight = Marionette.getOption @, "itemHeight"
            @buildTemplate()
          
        buildTemplate: ->
            @template = ""
            for column in @_columns
                @template += "<td>{{" + column + "}}</td>"

        onRender: ->
            @setHeight @_itemHeight if @_itemHeight

        setHeight: (h) ->
            @$el.css "height", h