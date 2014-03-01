define [
    "marionette"
    "baseBlockController"
    "baseComponent"
    "hbs!templates/modules/footer/footerComponentTpl"
], (Marionette, BaseBlockController, BaseComponent, FooterComponentTpl) ->

    class FooterController extends BaseBlockController
        initialize: (options) ->

            @applyOptions([
                "region"
                "declaration"
                ])

            @component = new BaseComponent
                declaration: @declaration
                context: @
                region: @region
                template: FooterComponentTpl

        show: ->
            @component.show()

        hide: ->
            @region.close()
