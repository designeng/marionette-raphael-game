define [
    "marionette"
    "linkControl"
], (Marionette, LinkControl) ->

    return FavoriteSearchControlView = LinkControl.extend
        className: "flightSearchHistory__favorite"

        template: "{{count}}"

        initialize: ->
            @context = Marionette.getOption @, "context"
            @listenTo(@model, 'change', @render);
            @listenTo(@context, 'hideFavorite', @hideFavorite);

        onRender: ->
            @checkFavoriteEnable()

        checkFavoriteEnable: ->
            if @model.get('count')>0
                @show(true)
            else
                @show(false)

        show: (state) ->
            if state
                @$el.show()
            else
                @$el.hide()

        onClick: ->
            alert('favorite click')
            return false

        hideFavorite:->
            @show(false)