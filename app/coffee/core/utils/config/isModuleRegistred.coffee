define ->
    isModuleRegistred = (moduleName) ->
        paths = requirejs.s.contexts._.config.paths
        
        # module sign - suffix "Controller" in homonymous folder  
        return !!paths[moduleName]