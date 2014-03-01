define [
    "backbone"
    "backbone.raphael"
    "marionette"
    "when"
], (Backbone, RaphaelView, Marionette, When) ->

    BoardControl = Marionette.Layout.extend

        className: ->
            @defaultClassName("board")

        events: {
            "click"     : "onClick"
        }

        initialize: (options) ->
            console.log "inited board control"
            @context = Marionette.getOption @, "context"

            console.log "CTX", @context

            # @applyModelProperties([
            #             "states"
            #         ], {prefix: @_attrPrefix})

        onRender: -> 
            console.log "rendered board"

        onClick: (e) ->
            console.log "clicked"

        # public api provider
        # publicApi: () ->
        #     return {
        #         "setActive": @setActive
        #     }

    BoardControl = _.extend BoardControl, RaphaelView

    return BoardControl