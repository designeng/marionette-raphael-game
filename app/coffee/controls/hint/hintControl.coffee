define ["backbone", "marionette"], (Backbone, Marionette) -> 

    HintControlView = Marionette.Layout.extend
        template: "{{text}}"

        className: ->
            @defaultClassName("hintControl")

        initialize: (options) ->

            
        onBeforeRender: ->
            @$el.css "width", @model.get("width") + "px"
            @$el.css "height", @model.get("height") + "px"
            @$el.css "background-color", @model.get("bgColor")
            @$el.css "border", "1px solid green"

