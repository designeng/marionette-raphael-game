define ["backbone"
        "marionette"
], (Backbone, Marionette) ->

    FlightPointView = Marionette.ItemView.extend

        template: "<div class='airportText'>{{name}}{{#if countryName}},{{/if}}  {{countryName}}  {{cityName}}</div> <div class='codeText'>{{#if codeSirena}}<span class='codeSirena'>{{codeSirena}},</span>{{/if}}{{#if codeIata}} <span class='codeIata'>{{codeIata}}</span>{{/if}}</div>"

        tagName: "li"

        events:
            "click"      :  "onClick"
            "mouseover"  :  "onOver"

        # default class name (do not use @defaultClassName)
        className:  "flightPoint"

        initialize: (options) ->
            @eventBus = Marionette.getOption @, "eventBus"

        onBeforeRender: ->
            if itemHeight = @model.get "itemHeight"
                @$el.css "height", itemHeight

            if className = @model.get "className"
                @$el.attr "class", className
                return
            if className = @model.get "itemClassName"
                @$el.attr "class", className
                return

        onRender: ->
            if @model.get("type") is "AIRPORT"
                @$el.addClass "flightPointItem--airport"            

        # will interact with "itemview:selected" event (@see Marionette docs)
        onClick: () ->
            @trigger "selected"

        onOver: ->
            @trigger "over"

        highLight: (hClass) ->
            @$el.addClass hClass

        unHighLight: (hClass) ->
            @$el.removeClass hClass






