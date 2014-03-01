define [
    "marionette"
], (Marionette) ->

    class BaseBlockController extends Marionette.Controller

        getComponent: ->
            return @component