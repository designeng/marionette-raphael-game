define [
    "backbone"
    "marionette"
    "controls/dropdownlist/mask/maskService"
    "controls/dropdownlist/dropdown/dropDownService"
    "controls/dropdownlist/report/reportingService"
    "core/utils/develop/collectionGenerator"
], (Backbone, Marionette, MaskService, DropDownService, ReportingService, collectionGenerator) -> 

    DropDownListView = Marionette.Layout.extend

        template: "<div class='listContainer'></div><div class='dropDownListMask'></div>"

        events:
            "click .dropDownListMask" : "clickMask"

        regions:
            dropDownRegion: ".listContainer"
            maskRegion: ".dropDownListMask"

        className: ->
            @defaultClassName "dropDownListHolder"

        initialize: (options) ->
            @context = Marionette.getOption @, "context"

            @applyModelProperties([
                "collection"
                "stayOpen"
                "itemType"
            ], {prefix: @_attrPrefix})

            @_keyEvents = ["enter", "down", "up", "home", "end", "page_up", "page_down", "tab", "space", "backspace", "esc"]

            # eventBus initialization and binding eventBus events
            @initEventBus()

            @collection = @_collection if !@collection         # @collection, as usial, if it was passed from options, injected implicit

            @maskService = new MaskService
                eventBus: @eventBus

            @dropDownService = new DropDownService
                eventBus: @eventBus
                itemType: @_itemType
                keyEvents: @_keyEvents

            # service to report about selected item
            @reportingService = new ReportingService
                context: @context
                eventBus: @eventBus
                maskService: @maskService
                dropDownService: @dropDownService

        initEventBus: ->
            _.bindAll @,
                "onMaskShow"
                "setMaskHeight"

            @eventBus = _.extend {}, Backbone.Events

            @eventBus.on "mask:show", @onMaskShow
            @eventBus.on "mask:height", @setMaskHeight

        onRender: ->
            @maskService.renderInRegion(@maskRegion)
            @maskService.setMaskStatus("hide")

            @dropDownService.initDropDownView
                model: @model
                collection: @collection

            @dropDownService.renderInRegion(@dropDownRegion)


        # when mask is active and clicked (mouse not moved) - current selected (at this case, =highlighted) item must be sent to destination
        # we use here "dropdownlist:click" event because correspondent eventStream is defined in reportingService
        # @see ReportingService
        clickMask: ->
            @reportingService.onMaskClicked()

        # mask proxy methods
        onMaskShow: ->
            @maskService.setMaskStatus "show"

        setMaskHeight: (height) ->
            @maskService.setMaskHeight height

        # public api

        setHeight: (h) ->
            @dropDownService.setHeight(h)

        # to influence from tests
        setDefaultMaxItemsToShow: (count) ->
            @dropDownService.setDefaultMaxItemsToShow(count)

            # collection methods
        addItemToCollection: (model) ->
            @dropDownService.addItemToCollection model

        cropCollection: (itemsCount) ->
            @dropDownService.cropCollection(itemsCount)

        resetCollection: ->
            @dropDownService.resetCollection()

        # / public api

        # public api provider
        publicApi: () ->
            return {
                "setHeight": @setHeight
                "addItemToCollection": @addItemToCollection
                "cropCollection": @cropCollection
                "resetCollection": @resetCollection
                "setDefaultMaxItemsToShow": @setDefaultMaxItemsToShow
            }