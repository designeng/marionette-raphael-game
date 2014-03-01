define ->
    isValidDate = (txtDate) ->
        currVal = txtDate
        return false  if currVal is ""
        rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/ #Declare Regex
        dtArray = currVal.match(rxDatePattern) # is format OK?
        return false  unless dtArray?
      
        #Checks for mm/dd/yyyy format.
        dtMonth = dtArray[3]
        dtDay = dtArray[5]
        dtYear = dtArray[1]
        if dtMonth < 1 or dtMonth > 12
            return false
        else if dtDay < 1 or dtDay > 31
            return false
        else if (dtMonth is 4 or dtMonth is 6 or dtMonth is 9 or dtMonth is 11) and dtDay is 31
            return false
        else if dtMonth is 2
            isleap = (dtYear % 4 is 0 and (dtYear % 100 isnt 0 or dtYear % 400 is 0))
            return false  if dtDay > 29 or (dtDay is 29 and not isleap)
        true