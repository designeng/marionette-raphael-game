define [
    "marionette"
], (Marionette) -> 
    # pass object for extention action in BaseActiveKey
    ListItemView = Marionette.ItemView.extend

        template: "{{data}}"

        className: "dropDownListItem"

        tagName: "li"

        events:
            "click"      :  "onClick"
            "mouseover"  :  "onOver"      

        initialize: (options) ->
            _.bindAll @, "onOver"

        onBeforeRender: ->
            @eventBus = Marionette.getOption @, "eventBus"

        onRender: ->
            @$el.css "height", @model.get "itemHeight"

        onClick: ->
            console.log "clicked"
            @eventBus.trigger "select",
                model: @model

        onOver: ->
            @trigger "over"

        hightLight: (hClass) ->
            @$el.addClass hClass

        unHightLight: (hClass) ->
            @$el.removeClass hClass



    return ListItemView