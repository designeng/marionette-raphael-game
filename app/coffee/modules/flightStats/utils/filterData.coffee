define ->
    filterData = (model) ->
        if inputName = model.get "inputName"

            if inputName in ["flightFrom", "flightTo"]
                point = 
                    id: parseInt(model.get("id"))
                    type: model.get "type"

            switch inputName
                when "flightFrom" then res = {
                        startPoint: point
                    }
                when "flightTo" then res = {
                        endPoint: point
                    }
                when "flightNumber" then res = {
                        flightNumber: model.get "data"
                    }

            return res