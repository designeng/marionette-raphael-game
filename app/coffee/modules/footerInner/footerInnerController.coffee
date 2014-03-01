define [
    "marionette"
    "baseBlockController"
    "baseComponent"
    "hbs!templates/modules/footer/footerInnerComponentTpl"
], (Marionette, BaseBlockController, BaseComponent, FooterInnerComponentTpl) ->

    class FooterInnerController extends BaseBlockController
        initialize: (options) ->
            @applyOptions([
                "region"
                "declaration"
                ])

            @component = new BaseComponent
                declaration: @declaration
                context: @
                region: @region
                template: FooterInnerComponentTpl

        show: ->
            @component.show()

        hide: ->
            @region.close()
