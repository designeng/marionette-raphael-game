define ->
    cleanData = (target) ->
        args = Array::slice.call(arguments, 1)
        if _.isString args
            arr = [].push args
        else
            arr = _.clone args
        for field in arr
            delete target[field]