define [
    "backbone"
    "marionette"
], (Backbone
    Marionette
    ) -> 
    
    TableHeaderView = Marionette.Layout.extend

        # TODO: allocate template to special file in template folder
        template: "<tr>{{#each headers}}
                    {{#if this}}
                        <th class='{{../../headerClassPrefix}}{{@index}}'>{{this}}</th>                    
                    {{else}}
                        <th class='blank'></th>               
                    {{/if}}
                    {{/each}}
                    </tr>"

        tagName: "thead"

        _upSortingClass: "upSorting"

        _downSortingClass: "downSorting"

        initialize: ->
            @applyOptions([
                    "eventBus"
                    "columns"
                    "headerHeight"
                    "headerClassPrefix"
                    "sortableFields"
                    "headers"
                    "tableController"
                ])

            @model = new Backbone.Model unless @model
            @model.set "headerClassPrefix", @headerClassPrefix
            @model.set "headers", @translateHeaders @headers

            _.bindAll @, "onHeaderClick"
            @on "header:click", @onHeaderClick

        translateHeaders: (loc_headers) ->
            return @prepareLocalized(loc_headers, "array")

        # but instead of direct binding here must be binding to rendered linkControls
        setHeaderHandlers: ->
            actualSorted = _.intersection @columns, @sortableFields

            for val, i in @columns
                if @getColumnHeader(i) in actualSorted
                    @setHandler i
                    @tableController.defineSortDirection i, true
                else
                    @tableController.defineSortDirection i, false

        setHandler: (i) ->
            @$el.find("th." + @headerClassPrefix + i).click( (e) =>
                    @trigger "header:click", i, $(e.target)
                )

        getColumnHeader: (i) ->
            return @columns[i]

        onHeaderClick: (i, $targetEl) ->
            @tableController.sort(@columns[i], i)

            @changeSortingClass $targetEl, i, @tableController.getDirection(i)   

        # if linkControl will be used in header, addClass and removeClass methods must be defined on it
        changeSortingClass: ($el, i, dir) ->
            $el.removeClass(@_upSortingClass).removeClass(@_downSortingClass)
            if dir > 0
                $el.addClass @_upSortingClass
            else if dir < 0
                $el.addClass @_downSortingClass

        onRender: ->
            @setHeaderHandlers()
            @setHeight @headerHeight

        setHeight: (h) ->
            @$el.find("tr").css "height", h