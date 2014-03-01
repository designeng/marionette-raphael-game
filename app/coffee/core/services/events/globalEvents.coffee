define [
    "jquery"
    "marionette"
    "underscore"
], ($, Marionette, _) ->

    GlobalEvents = Marionette.Controller.extend

        htmlEvents: ['html:click']
        windowsEvents: ['window:resize']

        initialize: ->
            @bindGlobalEvents()

        bindGlobalEvents: ->
            $(window).on 'resize', =>                               # window resize event
                sEvents = @joinEven('windowsEvents')
                @trigger sEvents, {
                    width: $(window).width()
                    height: $(window).height()
                }

            $("html").on 'click', (e) =>                            # html click event
                sEvents = @joinEven('htmlEvents')
                @trigger(sEvents, e)

        addHtmlEvent: (eventName) ->                                # for add custom events
            @htmlEvents.push(eventName)

        removeHtmlEvent: (eventName) ->                             # for remove custom events
            @htmlEvents = _.without(@htmlEvents, eventName)

        joinEven: (eventGroup) ->
            return @[eventGroup].join(' ')

    return globalEvents = new GlobalEvents() unless globalEvents?   # should be singleton
