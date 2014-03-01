define ["underscore"
        "marionette"
        "vent"
        "when"
        "moduleHash"
        "core/ioc/startComponentInRegion"        
        ], (_, Marionette, vent, When, moduleHash, startComponentInRegion) ->

    # ModuleWrapperViewModel

    ModuleWrapperViewModel = Backbone.Model.extend
        initialize: (options) ->
            @on "change:status", @onChange
        onChange: () ->
            # do smth additional on change

    # ModuleWrapperView

    ModuleWrapperView = Marionette.ItemView.extend
        
        className: "moduleWrapper"

        initialize: (options) ->
            @name = @model.get("name")

            promise = startComponentInRegion.call(@, @name, new Backbone.Marionette.Region({el: @$el}))

            success = (moduleObject) ->
                moduleHash.addModule moduleObject

            reject = (name) ->
                vent.trigger "module:not:exists", name

            When(promise, success, reject)

            _.bindAll @, "onModelStatusChanged"
            @model.on "change:status", @onModelStatusChanged

        onRender: ->
            @$el.attr "data-name", @name

        onModelStatusChanged: () ->
            status = @model.get "status"
            if status == "open"
                @showView()
            else if status == "shut"
                @closeView()

        showView: ->
            @controller.onShow() if @controller['onShow'] isnt undefined
            @$el.show('slow')

        closeView: ->
            @controller.onHide() if @controller['onHide'] isnt undefined
            @$el.hide('slow')

    # RegionCollectionView

    RegionCollectionView = Marionette.CollectionView.extend
        itemView: ModuleWrapperView

        initialize: (options) ->
            @collection = new Backbone.Collection()

        processConfig: (config) ->
            if !config.open
                return "No elements - close all if they were opened"
            # open or shut just by status change - all logic in ModuleWrapperView.onModelStatusChanged
            for name in config.open
                if name                  
                    modelSetToCheck = @collection.where({name: name})
                    if !modelSetToCheck[0]   
                        model = new ModuleWrapperViewModel(
                                name: name
                                status: "open"
                            )
                        @collection.add model
                    else if modelSetToCheck[0].get("status") == "shut"
                        modelSetToCheck[0].set "status", "open"

            for name in config.shut
                if name
                    modelSet = @collection.where({name: name})
                    if modelSet.length
                        modelSet[0].set("status": "shut")

            @collection.models


    # PageLayout 

    return Marionette.Layout.extend

        template: ""

        className: "pageLayout"

        regions: {
            # no regions initially
        }

        initialize: (options) ->
            @regionSet = {}
            @rm = @regionManager

            # "region:add" is built-in regionManager Marionette event
            @rm.on "region:add", (name, region) =>
                @regionSet[name] = {
                    region: null
                    view: null
                }
                @regionSet[name].region = region
                @regionSet[name].view = new RegionCollectionView()
                @regionSet[name].view.setElement(region.el)
                
                # @regionSet[name].region.show view

            vent.on "module:not:exists", (name) =>
                replacingElement = @$el.find "[data-name='#{name}']"
                targetElement = @$el.find("##{name}")
                replacingElement.replaceWith targetElement

        # calls once at least in runDisplayProcess method in pageController
        # @param {Object} pageStructure - Page Structure: keys are regions names, values are objects with declaration [to open]/[to shut]:
        #                 for example:
        #                   content: {
        #                       open: Array[....] - modules to open
        #                       shut: Array[....] - modules to shut
        #                   }
        processPageStructure: (pageStructure) ->
            for item of pageStructure
                # create appropriate region if not exists
                if !@regionSet[item]
                    $("<div id='#{item}'></div>").appendTo(@el)
                    @rm.addRegion item, '#' + item

                @reorganizeBlocksInRegion item, @rm.get(item), pageStructure[item]

        # modules (they are components) are rendered in in the corresponding blocks in regions
        reorganizeBlocksInRegion: (item, region, config) ->
            regionView = @regionSet[item].view
            regionView.processConfig(config)