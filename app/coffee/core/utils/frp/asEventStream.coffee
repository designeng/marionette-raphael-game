define [
    "bacon"
], (Bacon) ->
    next = (value) ->
        return new Bacon.Next(Bacon._.always(value))

    asEventStream = (eventName, eventTransformer) ->
        eventTransformer = Bacon._.id unless eventTransformer
        target = @

        return new Bacon.EventStream (sink) ->
            handler = ->
                args = (if 1 <= arguments.length then [].slice.call(arguments, 0) else [])
                reply = sink(next(eventTransformer.apply(null, args)))
                unbind()  if reply is Bacon.noMore

            unbind = ->
                target.off eventName, handler

            target.on eventName, handler
            return unbind