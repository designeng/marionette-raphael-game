define ["backbone"], (Backbone) ->
    DropDownListModel = Backbone.Model.extend
        defaults:
            display: false
            setFirstActive: true

    return DropDownListModel