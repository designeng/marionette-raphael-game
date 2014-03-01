define ["backbone"
        "marionette"
        "when"
], (Backbone, Marionette, When) ->

    StartGameControl = Marionette.Layout.extend

        className: ->
            @defaultClassName("startGameControl")

        events: {
            "click"     : "onClick"
        }

        initialize: (options) ->
            @context = Marionette.getOption @, "context"

            console.log "CTX", @context

            # @applyModelProperties([
            #             "states"
            #         ], {prefix: @_attrPrefix})

        onRender: -> 
            console.log "rendered start game"

        onClick: (e) ->
            console.log "clicked"

        # public api provider
        # publicApi: () ->
        #     return {
        #         "setActive": @setActive
        #     }




