define [
    "marionette"
    "when"
], (Marionette, When) ->

    class ModuleHash extends Marionette.Controller

        initialize: ->
            @moduleHash = {}
            @defferedObject = {}

        getHash: ->
            return @moduleHash

        addModule: (data) ->
            console.log "addModule >>>", data.module
            @moduleHash[data.name] = data.module

            # and resolve defferedObject[data.name]
            @defferedObject[data.name].resolve(data.module)

        getModuleAsPromise: (moduleName) ->
            @defferedObject[moduleName] = When.defer()
            return @defferedObject[moduleName].promise

        getModule: (moduleName) ->
            return @moduleHash[moduleName]

    return moduleHash = new ModuleHash() unless moduleHash?