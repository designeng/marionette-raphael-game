define [
    "marionette"
    "linkControl"
], (Marionette, LinkControl) ->

    return LinkFooterNavControlView = LinkControl.extend
        events:
            "click": "openFooterContacts"

        openFooterContacts: ->
            @context.options.context.trigger "openFooterBar:click", { model: @model }
            return false

