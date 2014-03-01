define [
    "marionette"
], (Marionette) ->
    class PreloaderView extends Marionette.ItemView

        template: "{{text}}"

        className: ->
            @defaultClassName("preloader")

