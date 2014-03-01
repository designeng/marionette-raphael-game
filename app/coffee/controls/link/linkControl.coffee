define ["marionette"
        "baseControl"
], (Marionette, BaseControl) ->

    return LinkControlView = BaseControl.extend
        tagName: "a"

        template: "{{#if icon}}
                        <span class='text'>{{loc_text}}</span><img alt='{{loc_text}}' src='{{icon}}' />
                    {{else}}
                        {{loc_text}}
                    {{/if}}"

        events:
            "click"     : "onClick"
            "mouseover" : "onOver"

        className: ->
            @defaultClassName "link"

        initialize: (options) ->
            # console.log '>', Marionette.getOption 'context'

            @context = Marionette.getOption(@, "model").get('context')
            @eventBus = Marionette.getOption @, "eventBus"                          # eventBus added for compatibility with dropDownListControl

            @applyModelProperties([
                "text"
                "url"
                "title"
                "icon"
                "highlightClass"
                "preventDefault"
                ], {prefix: @_attrPrefix})

            @translateText()

        translateText: ->
            localized = @prepareLocalized(@_text, "string")
            # to render translated text
            @model.set("loc_text", localized)
            return localized

        onBeforeRender: ->
            @$el.attr "href", @_url
            @$el.attr "title", @_title

        onRender: ->
            @isActiveLink()                                                         # test whether activate or not

        onOver: ->                                                                  # not tested
            @trigger "over"

        onClick: (e) ->                                                             # not tested
            if @_preventDefault
                e.preventDefault()
                e.stopPropagation()

            if @context
                @context.trigger "linkControl:click", {text: @model.get "text"}

            @confirm()                                                              # for interaction with RenderingService

            # on click we must poit to new location
            if !@_preventDefault
                @navigateTo @_url

        confirm: ->
            return @

        navigateTo: (url) ->
            window.location.hash = url

        isActiveLink: ->
            if @isActive(window.location.hash)
                @activate()

        isActive: (hash) ->
            return true && (hash == "#" + @_url) || false

        activate: ->
            @$el.addClass "active"

        highLight: (hClass) ->
            @$el.addClass hClass

        unHighLight: ->
            @$el.removeClass @_highlightClass

