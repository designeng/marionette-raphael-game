define [
    "marionette"
    "vent"
    "baseBlockController"
    "baseComponent"
    "hbs!templates/modules/debugConsole/debugConsoleComponentTpl"
    "modules/debugConsole/declaration"
], (Marionette, vent, BaseBlockController, BaseComponent, DebugConsoleComponentTpl, declaration) ->

    class DebugConsoleController extends BaseBlockController
        initialize: (options) ->
            @region = Marionette.getOption @, "region"

            @component = new BaseComponent(
                    declaration: declaration
                    context: @
                    region: @region
                    template: DebugConsoleComponentTpl
                )

            vent.on "mediator:collected:data", @onCollectedData                

        onCollectedData: (data) =>
            @trigger "collected:data",
                data: data

        show: ->
            @component.show()

        hide: ->
            @region.close()