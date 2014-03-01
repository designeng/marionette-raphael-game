define ["backbone"], (Backbone) ->
    createDictionary = (items, data) ->
        dictionary = {}
        for item in items
            dictionary[item] = new Backbone.Collection(data.dictionary[item])
        return dictionary