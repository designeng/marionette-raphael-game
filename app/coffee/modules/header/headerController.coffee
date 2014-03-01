define ["marionette"
        "baseBlockController"
        "baseComponent"
        "hbs!templates/modules/header/headerComponentTpl"
], (Marionette, BaseBlockController, BaseComponent, headerComponentTpl) ->

    class HeaderController extends BaseBlockController
        initialize: (options) ->
            
            @applyOptions([
                "region"
                "declaration"
                ])

            @component = new BaseComponent(
                    declaration: @declaration
                    context: @
                    region: @region
                    template: headerComponentTpl
                )

        show: ->
            @component.show()

        hide: ->
            @region.close()
