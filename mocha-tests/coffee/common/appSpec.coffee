define [
    "when"
], (WhenP) ->
    class AppSpec
        currentSpec: null

        constructor: (spec) ->
            @currentSpec = spec

        setSpec: (spec) ->
            spec.setPromise = @setPromise
            @currentSpec = spec

        getSpec: ->
            return @currentSpec

        removeSpec: ->
            @currentSpec = null

        setPromise: (promise, target, resultProp, doneFn) ->
            WhenP(promise).then(
                (res) =>
                    # console.log "RES::::::", res
                    target[resultProp] = res
                    doneFn()
                (err) =>
                    console.log "ERR", err
                    doneFn()
            )

    if !appSpec
        appSpec = new AppSpec()

    return appSpec