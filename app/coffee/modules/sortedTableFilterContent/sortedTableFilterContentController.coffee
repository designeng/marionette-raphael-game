define [
    "marionette"
    "baseComponent"
], (Marionette, BaseComponent) ->

    return sortedTableFilterContentController = Marionette.Controller.extend
        initialize: (options) ->
            @region = Marionette.getOption @, "region"
            @declaration = Marionette.getOption @, "declaration"

            @component = new BaseComponent
                declaration: @declaration
                context: @
                region: @region

        show: ->
            @component.show()
            @triggerMethod "show"

        close: ->
            @component.close()





