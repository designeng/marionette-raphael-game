define [
    "vent"
    "resolver"
    "when"
    "core/ioc/utils/getActualTypes"
    "core/ioc/utils/afterTypesLoaded"
    "core/utils/config/isModuleRegistred"
], (vent, resolver, When, getActualTypes, afterTypesLoaded, isModuleRegistred) ->

    # @returns promise for further operations with resolved object
    # @example ModuleWrapperView.initialize
    startComponentInRegion = (name, region) ->
        defered = When.defer()

        # if module is not registred in requirejs config
        if !isModuleRegistred name            
            defered.reject name
        else 
            require [
                    name
            ], (ModuleClass) =>

                require [
                    "text!modules/" + name + "/declaration.js"
                    "modules/" + name + "/declaration"
                ], (declarationAsText, declaration) =>

                    types = getActualTypes(declarationAsText)

                    callback = (res) =>
                        @module = new ModuleClass(
                                region: region
                                declaration: declaration
                                context: @
                            )

                        defered.resolve({
                                name: name
                                module: @module
                            })

                        # if show method provided by module, it will be invoked
                        if @module["show"]
                            @module.show()

                    errback = (err) =>
                        console.log "ERROR", err

                    # TODO: may be promise returned by this func must be considered in resolving

                    afterTypesLoaded(types, callback, errback)

        return defered.promise