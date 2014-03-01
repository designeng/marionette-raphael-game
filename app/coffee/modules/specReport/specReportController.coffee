define ["marionette"
        "vent"
        "baseBlockController"
        "baseComponent"
        "hbs!templates/modules/specReport/specReportComponentTpl"
        "modules/specReport/declaration"
], (Marionette, vent, BaseBlockController, BaseComponent, SpecReportComponentTpl, declaration) ->

    class SpecReportController extends BaseBlockController
        initialize: (options) ->
            @region = Marionette.getOption @, "region"

            @component = new BaseComponent(
                    declaration: declaration
                    context: @
                    region: @region
                    template: SpecReportComponentTpl
                ) 

            @component.show()   

        onCollectedData: (data) =>
            @trigger "collected:data",
                data: data            

        hide: ->
            @region.close()