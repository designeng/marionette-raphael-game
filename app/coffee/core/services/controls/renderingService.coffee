define [
    "backbone"
    "marionette"
    "meld"
    "globalEvents"
    ], (Backbone, Marionette, meld, globalEvents) ->

    RsRegion = Marionette.Region.extend
        initialize: ->
            @el = Marionette.getOption @, "el"

    RenderingService = Marionette.Controller.extend
        hash: {}

        initialize: ->
            _.bindAll @, "afterViewRenderAspect", "onHtmlClick"

            meld.after(Marionette.Layout::, "render", @afterViewRenderAspect)

            globalEvents.on "html:click", @onHtmlClick          # need to close innerComponent region

        afterViewRenderAspect: (layout) -> 
            return if !layout.model                             # TODO: a sort of hack - needed to be explored

            if innerComponent = layout.model.get "innerComponent"
                if innerComponent.connectTo
                    # connect to method expected to be trigger for showing inner view
                    @createConnection(layout, innerComponent.connectTo)

                @defineRegion(layout)

                @hash[layout.cid] = @registerInnerComponent(layout, innerComponent)

                # buffer processing
                if innerComponent.buffer
                    @processBuffer(layout, innerComponent.buffer)

        createConnection: (layout, methodToConnect) ->
            layout.removers = [] unless layout.removers

            showInnterContent = => 
                @showInner(layout.cid)

            # create connection aspect and push it to removers array
            layout.removers.push( meld.after(
                layout,                 # where (on what object) listen
                methodToConnect,        # before what function apply, call aspect-function 
                showInnterContent       # aspect-function 
            ))

        # require wrapper
        requireClass: (type) ->
            return require type  

        # register for rendering inner component (view) in layout rsRegion
        registerInnerComponent: (layout, innerComponent) ->
            rsRegion = layout.regionManager.get("rsRegion")
            # console.error '1', innerComponent.innerComponentType

            innerComponentClass = @requireClass(innerComponent.innerComponentType)
            # console.error '2', innerComponent
            view = new innerComponentClass(         # for example dropDownListControl
                model: innerComponent.model
            )
            # console.error '3', view

            hashObject = {
                layout: layout
                region: rsRegion
                view: view
                behaviour: innerComponent.behaviour
            }

            return hashObject

        processBuffer: (layout, buffer) ->
            keys = _.keys buffer
            for key in keys
                bufferFunctions = buffer[key]

                if key is "layout"
                    mapper = (func) =>
                        func.call @, layout
                else if key is "view"
                    mapper = (func) =>
                        func.call @, @getCorrespondentView(layout)

                _.map bufferFunctions, mapper

        # used in flightStats/declaration.coffee:
        getRegion: (layout) ->
            return @hash[layout.cid].region

        getCorrespondentView: (layout) ->
            return @hash[layout.cid].view

        showInner: (cid) ->
            region = @hash[cid].region
            view = @hash[cid].view
            behaviour = @hash[cid].behaviour

            if !@hash[cid].status
                @hash[cid].status = -1

            if @hash[cid].status < 0
                if region.currentView != view
                    region.show view
            else
                region.close()

            if behaviour and behaviour.toggle
                @hash[cid].status *= -1

            if @currentActiveCid and @currentActiveCid != cid
                @closeCurrentActive()
                @currentActiveCid = cid

            if cid and !@currentActiveCid
                @currentActiveCid = cid

        closeCurrentActive: () ->
            behaviour = @hash[@currentActiveCid].behaviour

            if behaviour and behaviour.closeWithOuterClick
                @hash[@currentActiveCid].region.close()
                @hash[@currentActiveCid].status = -1

        # html click is outer click, so
        onHtmlClick: ->
            if !@currentActiveCid
                return
            else
                @closeCurrentActive()
                @currentActiveCid = undefined

        # define additional region in target layout
        defineRegion: (layout) ->
            layoutCid = layout.cid
            layout.$el.append("<div class='#{layoutCid}_rsRegion'></div>")

            rsRegion = new RsRegion(
                    el: "." + "#{layoutCid}_rsRegion"
                )

            layout.addRegion "rsRegion", rsRegion

    # should be singleton
    return renderingService = new RenderingService() unless renderingService?