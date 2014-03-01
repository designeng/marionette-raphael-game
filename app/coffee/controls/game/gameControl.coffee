define [
    "backbone"
    "backbone.raphael"
    "marionette"
    "when"
], (Backbone, RaphaelView, Marionette, When) ->

    GameControl = Marionette.Layout.extend

        className: ->
            @defaultClassName("gameControl")

        events: {
            "click"     : "onClick"
        }

        initialize: (options) ->
            console.log "inited game control"
            @context = Marionette.getOption @, "context"

            console.log "CTX", @context

            # @applyModelProperties([
            #             "states"
            #         ], {prefix: @_attrPrefix})

        onRender: -> 
            console.log "rendered"

        onClick: (e) ->
            console.log "clicked"

        # public api provider
        # publicApi: () ->
        #     return {
        #         "setActive": @setActive
        #     }

    GameControl = _.extend GameControl, RaphaelView

    return GameControl