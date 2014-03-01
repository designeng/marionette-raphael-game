define ["marionette"
        "baseBlockController"
        "baseComponent"
], (Marionette, BaseBlockController, BaseComponent) ->

    class GameController extends BaseBlockController
        initialize: (options) ->
            
            @applyOptions([
                "region"
                "declaration"
                ])

            console.log "@declaration", @declaration

            @component = new BaseComponent(
                    declaration: @declaration
                    context: @
                    region: @region
                    template: ""
                )

        show: ->
            @component.show()

        hide: ->
            @region.close()
