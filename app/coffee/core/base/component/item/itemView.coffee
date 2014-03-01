define ["backbone"
        "marionette"
        "when"
        "function"
        "meld"
        "resolver"
        "controlContainerService"
        "core/utils/dom/queryViewForSelector"
        "_.str"
], (Backbone, Marionette, When, fn, meld, resolver, controlContainerService, queryViewForSelector) ->

    # ControlItemView for item-control rendering in core/base/component/baseComponent : ComponentCompositeView
    # it is intended to be a control wrapper and sandbox 
    # (a sort of buffer between component and partial control)

    ControlItemView = Marionette.ItemView.extend

        # no need any more in explicit template; all attributes will be ascribed to main div
        # template: "<div controlType='{{controlType}}' model='controlModel'>"

        _publicApi: null

        setRootClass: (rootClass) ->
            @rootClass = rootClass

        initialize: ->
            @$el.attr @attributes

            @context = Marionette.getOption @, "context"

            # TODO: to remove
            # @context = (@model.get "controlModel").get "context"

            @dataModel = @model.get "dataModel"

            @apiDefer = When.defer()
            @isResolvedDefer = When.defer()

        onRender: ->
            # find all elements with "control" attribute
            controls = queryViewForSelector(@, "[control]")

            _.each(controls, (item) =>
                    controlType = $(item).attr("control")         
                    modelLink = $(item).attr("model")

                    $el = $(item)
                    
                    if _.isObject modelLink #maybe it's never be done
                        model = modelLink
                    else if _.isString modelLink
                        model = @model.get modelLink             

                    # core control loading
                    # load specified control type 
                    resolver.resolveControl controlType, (viewClass) =>
                        # and render instance
                        @processNestedView($el, resolver.resolveControlInstance(viewClass, {model: model, dataModel: @dataModel, context: @context}))
                        @isResolvedDefer.resolve(@)
                )

            if @rootClass
                @className = @rootClass

        commonAfterRenderAspect: ->
            context = Marionette.getOption @, "context"
            context.trigger "component:control:rendered", @

        processNestedView: ($el, view, model) ->
            @providePublicApi(view)

            # register view in controlContainerService
            controlContainerService.add view
            
            @defineCompositeClassName view

            remCommonAfterRender = meld.after view, "render", @commonAfterRenderAspect   

            $el.replaceWith view.$el

            view.render()

        providePublicApi: (view) ->
            if view["publicApi"]
                @_publicApi = 
                    target: view
                    api: _.result view, "publicApi"

                @apiDefer.resolve(@_publicApi)

        getPublicApi: (test) ->
            return @apiDefer.promise

        isResolved: () ->
            return @isResolvedDefer.promise

        callPublic: (funcName) ->
            data = Array::slice.call(arguments)
            data = _.rest data

            if @_publicApi.api[funcName]
                @_publicApi.api[funcName].apply @_publicApi.target, data
            else
                # TODO
                @isResolvedDefer.reject("some reason")
 
        # the part of BEM realization
        # TODO: allocate it in special class (object)
        defineCompositeClassName: (view) ->
            if @rootClass
                compositeClassName = _.filter(@rootClass.split(" "), (name) ->
                        return name unless name in ["", " "] and _.str.endsWith.call(@, name, "__item")
                    )[0]
                view.compositeClassName = compositeClassName
                return compositeClassName

        # currently @$el in blank, so re-appoint it in compositeView
        setRootElement: ($el) ->
            @$el = $el

        hide: ->
            @$el.hide()
        show: ->
            @$el.show()

        beforeClose: ->
            if @modelBinder
                @modelBinder.unbind()

            if @removers
                for rem in @removers
                    rem.remove()

    return ControlItemView