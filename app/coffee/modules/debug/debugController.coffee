define [
    "marionette"
    "when"
    "baseBlockController"
    "baseComponent"
    "hbs!templates/modules/debug/debugComponentTpl"
    "modules/debug/declaration"], 
(Marionette, When, BaseBlockController, BaseComponent, DebugComponentTpl, declaration) ->

    class DebugController extends BaseBlockController
        initialize: (options) ->
            @region = Marionette.getOption @, "region"

            @component = new BaseComponent(
                    declaration: declaration
                    context: @
                    region: @region
                    template: DebugComponentTpl
                )

        show: ->
            @component.show()
            @triggerMethod "show"

        hide: ->
            @region.close()

        onShow: ->
            itemsToShow = ["flightPointNotFound", "support", "test"]
            When(@component.getControlByTypeName("infoControl").isResolved()).then((target) =>
                target.callPublic("setInfoCases", itemsToShow)
            )