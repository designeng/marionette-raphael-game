define ["marionette", "Handlebars"
], (Marionette, Handlebars) ->

    TextControlView = Marionette.Layout.extend
        template: "{{safeText text}}"

        className: ->
            @defaultClassName "textControl"

        events:{
            "click": "onClick"
            "mouseover": "onOver"
        }

        initialize: (options) ->
            @applyModelProperties([
                "itemHeight"
                "itemClassName"
                ], {prefix: @_attrPrefix})

        onBeforeRender: -> 
            # if itemHeight = @model.get "itemHeight"
            #     @$el.css "height", itemHeight

            # if className = @model.get "className"
            #     @$el.attr "class", className
            #     return
            # if className = @model.get "itemClassName"
            #     @$el.attr "class", className
            #     return

            if @_itemHeight
                @$el.css "height", @_itemHeight

            if @_itemClassName
                @$el.attr "class", @_itemClassName

        onOver: ->
            @trigger "over"

        hightLight: (hClass) ->
            @$el.addClass hClass

        unHightLight: (hClass) ->
            @$el.removeClass hClass