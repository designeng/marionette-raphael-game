define ["marionette"], (Marionette) ->
    ReportingService = Marionette.Controller.extend
        initialize: ->
            @context = Marionette.getOption @, "context"
            @eventBus = Marionette.getOption @, "eventBus"
            @maskService = Marionette.getOption @, "maskService"
            @dropDownService = Marionette.getOption @, "dropDownService"

            _.bindAll @,
                "onCurrent"
                "onEnter"
                "onClick"
                "report"            
            
            @eventBus.on "dropdownlist:current", @onCurrent
            @eventBus.on "dropdownlist:click", @onClick
            @eventBus.on "dropdownlist:enter", @onEnter

            # streams correspondently to selection events
            clickStream = @.asEventStream("click")
            clickStream.onValue (model) =>
                @currentModel = model

            enterStream = @.asEventStream("enter")
            enterStream.onValue (model) =>
                @currentModel = model

            currentStream = @.asEventStream("current")
            currentStream.onValue (model) =>
                @currentModel = model

            resultStream = Bacon.mergeAll(clickStream, enterStream).toProperty()

            resultStream.onValue (model) =>
                @currentModel = model
                @report model

        # when item highlighted via over event
        onCurrent: (model) ->
            @trigger "current", model

        onClick: (model) ->
            @trigger "click", model

        onEnter: (model) ->
            @trigger "enter", model

        report: (model) ->
            @returnData model
            @closeSession()
            return model

        closeSession: ->
            @maskService.setMaskStatus "hide"
            @dropDownService.closeRegion()

        onMaskClicked: ->
            @report @currentModel

        # return result data by triggering event in defined context
        returnData: (model) ->
            @context.trigger "option:selected", model

        # useful in tests
        getCurrentModel: ->
            return @currentModel
