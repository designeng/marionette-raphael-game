define [
    "backbone"
    "bacon"
    "eventstreams"
], (Backbone, Bacon) ->

    class ComboboxListCollection extends Backbone.Collection

        initialize: ->
            @collectionStream = @asEventStream("add remove reset change").map(this).toProperty()    

        getCollectionStream: ->
            return @collectionStream