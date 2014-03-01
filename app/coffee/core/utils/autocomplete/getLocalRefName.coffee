define [], ->
    charToUpper = (str) ->
        str = str.charAt(0).toUpperCase() + str.slice(1)
        str

    getLocalRefName = (locale) ->
        "name" + charToUpper(locale)

    return getLocalRefName