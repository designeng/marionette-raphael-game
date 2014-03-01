define ->
    keyFunctions = {
        onSpace: (e) ->
            return "space"
        
        onLeft: (e) ->
            return "left"

        onRight: (e) ->
            return "right"  

        onUp: (e) ->            
            return "up"

        onDown: (e) -> 
            return "down"

        onTab: (e) ->
            return "tab"
            
    }

    bindKeyMethods = (keyEvents) ->
        _.extend @, keyFunctions


    return bindKeyMethods