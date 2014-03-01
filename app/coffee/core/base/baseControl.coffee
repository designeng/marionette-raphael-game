define [
    "backbone"
    "marionette"
], (Backbone, Marionette) ->

    return BaseControl = Marionette.Layout.extend
        className: ->
            @model.get "className" if @model

        initialize: (options) ->
            

