define ["backbone"
        "marionette"
        "comboboxListCollection"
        "getLocale"
        "core/utils/autocomplete/getLocalRefName"
        "core/utils/collection/item/getItemStringLength"
        "utils/collection/dictionary/createDictionary"
], (Backbone, Marionette, ComboboxListCollection, getLocale, getLocalRefName, getItemStringLength, createDictionary) ->

    ComboboxListItemModel = Backbone.Model.extend
        initialize: (options) ->
            unless typeof options is "undefined"
                @set
                    name: options.name
                    codeIata: options.codeIata
                    codeSirena: options.codeSirena
                    type: options.type

    ComboboxController = Marionette.Controller.extend

        initialize: (options) ->
            @applyOptions([
                "inputName"
                "url"
                "input"])

            @_locale = getLocale()

            _.bindAll @, "onSuccess"

        doSearch: (data) ->
            $.ajax
                url: @url
                type: "GET"
                data:
                    query: data
                    lang: @_locale

                success: @onSuccess
                error: @onError

        onSuccess: (responce) ->
            return  if typeof responce is "undefined" or not responce?

            @listCollection = @createComboboxListCollection(responce)

            @trigger "listdata",
                collection: @listCollection
                inputName: @inputName      

        onError: (error) ->
            console.log "ERROR", error


        createComboboxListCollection: (responce) ->
            _inputName = @inputName

            locale = getLocalRefName(@_locale)
            listCollection = new ComboboxListCollection()

            dictionary = createDictionary(["AIRPORT", "CITY", "COUNTRY"], responce)

            $(responce.data.items).each (index) ->
                dictionaryModel = undefined
                dictionaryCountryModel = undefined
                countryName = undefined                

                dictionaryModel = dictionary[@reference.type].findWhere(id: @reference.id)
                country = dictionaryModel.get("country")
                city = dictionaryModel.get("city")

                item = new ComboboxListItemModel(
                        id: dictionaryModel.id
                        name: dictionaryModel.get(locale)
                        codeIata: dictionaryModel.get("codeIata")
                        codeSirena: dictionaryModel.get("codeSirena")

                        type: @reference.type
                         
                        # service (locale) information 
                        # only for corresponding item view with controller
                        inputName: _inputName
                        modelIndex: index
                    )

                if country and country.id
                    countryName = dictionary["COUNTRY"].findWhere(id: country.id).get(locale)
                    item.set "countryName", countryName
                else if city and city.id
                    cityName = dictionary["CITY"].findWhere(id: city.id).get(locale)
                    item.set "cityName", cityName

                # or may be better get element width directly, from flightPointControl at this case
                itemStringLength = getItemStringLength(item)
                item.set "itemStringLength", itemStringLength
                    
                listCollection.add item

            listCollection  

    return ComboboxController
