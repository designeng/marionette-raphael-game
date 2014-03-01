define ["marionette"
        "when"
        "baseBlockController"
        "baseComponent"
        "core/utils/develop/collectionGenerator"
], (Marionette, When, BaseBlockController, BaseComponent, collectionGenerator) ->

    class SortedTableController extends BaseBlockController
        
        initialize: (options) ->    

            @applyOptions([
                "region"
                "declaration"
                ])

            @component = new BaseComponent(
                    declaration: @declaration
                    context: @
                    region: @region
                )

        show: ->
            @component.show()
            # for @onShow triggering
            @triggerMethod "show"

        onShow: ->
            When(@component.getControlByTypeName("tableControl").isResolved()).then((target) =>
                target.callPublic("exposeCollection", collectionGenerator(7, ["data", "nextfield", "somefield"], {mode: "numbers"}))

                # demo of public api "addItemToCollection" method
                item = new Backbone.Model(
                        data: "22222_new"
                        nextfield: "33333_new"
                        somefield: "44444_new"
                    )

                target.callPublic("addItemToCollection", item)
            )   

        close: ->
            @component.close()