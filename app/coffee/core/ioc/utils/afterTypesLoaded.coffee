define [
    "resolver"
    "when"
    ], (resolver, When)->
    afterTypesLoaded = (types, callback, errback) ->
        promises = []         

        # this trick has only one goal - to provide early loading of requirejs-modules
        # before they will be injected with synchronized version of 'require' 
        for type in types
            promise = When.promise( (resolve, reject, notify) ->
                    resolver.resolve type, resolve, reject, (classType) ->
                        # do smth additional with loaded classType
                )
            promises.push promise

        # invoke callback after promises resolved
        # and return promise at once
        return When.all(promises).then(callback, errback)
