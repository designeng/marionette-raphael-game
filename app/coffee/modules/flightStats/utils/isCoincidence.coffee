define ->
    isCoincidence = (segment) ->
        try
            if segment.startPoint.id and segment.startPoint.id == segment.endPoint.id and segment.startPoint.type == segment.endPoint.type
                return true
            else
                return false
        catch
            return false