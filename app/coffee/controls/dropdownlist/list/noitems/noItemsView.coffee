define ["marionette"], (Marionette) ->
    NoItemsView = Marionette.ItemView.extend
        template: "{{noItemsMessage}}"

        tagName: "li"

        className: ->
            @defaultClassName("dropDownListItem--noItem")

        events:
            "click": "onClick"

        onClick: ->
            @eventBus = Marionette.getOption @, "eventBus"
            @eventBus.trigger "select",
                model: "empty"