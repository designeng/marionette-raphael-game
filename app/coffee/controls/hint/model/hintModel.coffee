define ["backbone"], (Backbone) ->
    HintModel = Backbone.Model.extend
        defaults:
            className: "hintControl"
            width: 600
            height: 50
            bgColor: "red" 