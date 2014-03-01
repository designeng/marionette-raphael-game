define ["backbone"
        "marionette"
        "when"
        "meld"
        "hbs!templates/component/default/defaultComponentTpl"
        "core/base/component/item/itemView"
        "core/base/component/utils/defineTargetElement"   
        ], (Backbone, Marionette, When, meld, DefaultComponentTpl, ControlItemView, defineTargetElement) ->

    ComponentCompositeView = Marionette.CompositeView.extend

        template: ->
            Marionette.getOption @, "template"

        className: "CompositeView"

        itemView: ControlItemView

        itemViewOptions: (model) ->
            attributes =
                control: model.attributes.controlType
                model: "controlModel"                                                   # here we marked attribute from where control model will be retrieved
                dataModel: model.attributes.dataModel
            options = {}
            options.attributes = attributes
            options.context = @context
            return options

        beforeInitialize: ->                                                            # ! this method call before ComponentCompositeView is initialize
            @model = new Backbone.Model()                                               # component (at first) is not a form or popup

            @declaration = Marionette.getOption @, "declaration"

            if @declaration.componentModel                                              # work with componentModel if exist
                @model = @declaration.componentModel
                switch @model.get("componentType")
                    when "form" then @isForm = true

        initialize: (options) ->
            # for element binding in appendHtml
            # TODO: to think: is not potentialy dangerous? some previosly defined model with the same cid can be re-defined...
            @model.set "cid", @cid

            @renderDefer = Marionette.getOption @, "renderDefer"

            componentItems = @declaration.componentItems
            @context = Marionette.getOption @, "context"

            if @declaration.componentModel
                formOptions = 
                    action: @declaration.componentModel.get "action", 
                    dataModel: @declaration.componentModel.get "dataModel"
                    ajax: @declaration.componentModel.get "ajax"

                @context = _.extend @context, formOptions

            # define context.validator # ?
            if @isForm
                @context.validator = {}

            # TODO: optimise this - move inputErrorHandlerCid definition to partial block of functionality
            # for simplicity and error communication report to context about inputErrorHandlerCid
            if @model.has "inputErrorHandlerCid"
                _inputErrorHandlerCid = @model.get "inputErrorHandlerCid"
                # set inputErrorHandlerCid as property to @context
                @context.inputErrorHandlerCid = _inputErrorHandlerCid

            #  transmit dependencies
            for item in componentItems
                #  transmit further "inputErrorHandlerCid" attribute to collection models
                if @model.has "inputErrorHandlerCid"
                    # and set inputErrorHandlerCid as property to item.controlModel
                    # TODO: may be better move it to options
                    item.controlModel.set {"inputErrorHandlerCid": _inputErrorHandlerCid}

            if @declaration.componentModel
                @_rootClass = @declaration.componentModel.get("rootClass")
                itemClasses = @declaration.componentModel.get("itemClasses")

                if @_rootClass && itemClasses
                    @className = @_rootClass
                    itemClasses = _.map itemClasses, (item) =>
                        return @_rootClass + "__" + item + " " + @_rootClass + "__item"
                    @model.set "itemClasses", itemClasses

            @collection = new Backbone.Collection(componentItems)

        onRender: ->
            if @isForm
                attributes = _.extend({}, _.result(@, 'attributes'))

                # action for tagName = "form" will be added
                extention = {'class': @className, "action": @model.get "action"}

                attrs = _.extend(attributes, extention)
                @$el.attr(attrs)

            @renderDefer.resolve(@)

        # report by triggering to @context about every added item
        onAfterItemAdded: (itemView) ->
            @context.trigger "component:collection:item:added", itemView

        appendHtml: (collectionView, itemView, index) ->
            targetElement = defineTargetElement.call @, collectionView, index

            # pass down the class to itemView for BEM realization
            itemView.setRootClass(targetElement.attr "class")

            # as itemView.$el will be changed after control inserting, we must re-appoint root element (Backbone.view.$el)
            itemView.setRootElement(targetElement)

            targetElement.append itemView.el


    # defined before aspect for ComponentCompositeView::initialize method
    @remBefore = meld.before ComponentCompositeView::, "initialize", ComponentCompositeView::beforeInitialize

    return Component = Marionette.Controller.extend                                 # return Component as wrapper controller for strategically important ComponentCompositeView

        template: DefaultComponentTpl                                               # template will be received from this field if no template defined in initialize options

        initialize: (options) ->
            @setOptions()

            @renderDefer = When.defer()

            @layout = new ComponentCompositeView
                context     : @context
                template    : @template
                declaration : @declaration
                renderDefer : @renderDefer

            @bindOnItemAdd()

        setOptions: ->
            @controlHash = {}

            @region = Marionette.getOption @, "region"
            @context = Marionette.getOption @, "context"
            @template = Marionette.getOption @, "template"
            @declaration = Marionette.getOption @, "declaration"

        bindOnItemAdd: ->
            _.bindAll(@, "onItemAdded")
            @context.on("component:collection:item:added", @onItemAdded)

        show: ->
            @region.show(@layout)

        isRendered: ->
            return @renderDefer.promise

        close: ->
            @region.close()

        onItemAdded: (item) ->
            return @controlHash[item.model.get("controlType")] = item

        getComposition: ->
            return @layout

        getChildren: ->
            return @layout.children

        getControlByIndex: (index) ->
            return @getChildren().findByIndex(index)

        getControlByTypeName: (typeName) ->                                         # return only last item with defined typeName
            return @controlHash[typeName]
