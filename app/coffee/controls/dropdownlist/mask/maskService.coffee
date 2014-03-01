define [
    "backbone"
    "marionette"
], (Backbone, Marionette) -> 
    
    MaskView = Marionette.ItemView.extend

        className: "maskServiceView"

        events:
            "mousemove" : "hideMask"

        initialize: ->
            @eventBus = Marionette.getOption @, "eventBus"

        setMaskWidth: (width) ->
            @$el.css "width", width

        setMaskHeight: (height) ->
            @$el.css "height", height

        getMaskHeight: ->
            return @$el.css "height"

        setMaskStatus: (status) ->
            if status == "hide"                
                @status = "hidden"
            else if status == "show"
                @status = "shown"

            if status == "show"
                @$el.show()
            else if status == "hide"
                @$el.hide()

        # mask will be hide by mouse move, but it must be a real move
        hideMask: (event) ->
            startingTop = 0
            startingLeft = 0
            distance = Math.round(Math.sqrt(Math.pow(startingTop - event.clientY, 2) + Math.pow(startingLeft - event.clientX, 2)))

            if !@_lastDistance
                @_lastDistance = distance
            
            absDiff = Math.abs(@_lastDistance - distance)
            @_lastDistance = distance

            if 3 > absDiff > 0 and absDiff != 0
                setTimeout( () =>
                    @setMaskStatus "hide"
                , 0)

        getStatus: ->
            return @status

    MaskService = Marionette.Controller.extend
        initialize: ->
            @maskView = new MaskView
                eventBus: Marionette.getOption @, "eventBus"

        renderInRegion: (region) ->
            region.show @maskView

        setMaskStatus: (status) ->
            @maskView.setMaskStatus(status)

        getMaskStatus: ->
            return @maskView.getStatus()

        setMaskWidth: (width) ->
            @maskView.setMaskWidth(width)

        setMaskHeight: (height) ->
            @maskView.setMaskHeight(height)

        getMaskHeight: ->
            @maskView.getMaskHeight()

        getMaskView: ->
            return @maskView

    return MaskService

