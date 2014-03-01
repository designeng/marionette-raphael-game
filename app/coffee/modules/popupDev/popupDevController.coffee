define [
    "marionette"
    "baseBlockController"
    "baseComponent"
    "appinstance"
], (Marionette, BaseBlockController, BaseComponent, App) ->

    class PopupDevController extends BaseBlockController

        initialize: (options) ->
            # console.error App
            @region = Marionette.getOption @, "region"

            # it can be taken from define arguments, or from options (in specs)
            @declaration = Marionette.getOption @, "declaration"

            if @declaration.componentModel.get('componentType') == "popup"
                $('.pageContainer').append('<div class="popup"></div>')
                App.addRegions({
                    popupRegion: ".popup"
                })
                @region = App.popupRegion

            @component = new BaseComponent
                declaration: @declaration
                context: @
                region: @region

        show: ->
            @triggerMethod "show"                   # for @onShow triggering

        close: ->
            @component.close()

        onShow: ->
            @component.show()
            @region.$el.show()

        onHide: ->
            @region.$el.fadeOut 'fast', =>
                @region.close()

