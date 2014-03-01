define [
    "marionette"
    "when"
    "baseBlockController"
    "baseComponent"
    "core/utils/develop/collectionGenerator"
    "filterBaseMediator"
], (Marionette, When, BaseBlockController, BaseComponent, collectionGenerator, FilterTableMediator) ->

    class SortedTableFilterController extends BaseBlockController
        initialize: (options) ->
            @applyOptions(["region","declaration"])

            @filterTableMediator = @getFilterTableMediator()

            @component = new BaseComponent
                declaration: @declaration
                context: @
                region: @region

        show: ->
            @component.show()
            @fillTableRowsData()
            @setTableCollection()

        close: ->
            @component.close()

        getFilterTableMediator: ->
            return filterTableMediator =  new FilterTableMediator

        getTableControl: ->
            return @component.getControlByTypeName("tableControl")

        fillTableRowsData: ->
            modes   = {mode: "numbers"}
            fields  = ["data", "nextfield", "somefield"]
            When(@getTableControl().isResolved()).then (target) =>
                target.callPublic( "exposeCollection", @getRandomDataCollection() )

        getRandomDataCollection: ->
            modes   = {mode: "numbers"}
            fields  = ["data", "nextfield", "somefield"]
            return  collectionGenerator(5, fields, modes)

        setTableCollection: ->
            When(@getTableControl().isResolved()).then (target) =>
                tableCollection = target.callPublic("getCollection")
                @filterTableMediator.setTableCollection( tableCollection )

        getFiltedDataModel: ->
            return filtedDataModel

