define ["marionette"
        "i18n!nls/general"
        "core/utils/locale/prepareLocalized"
], (Marionette, localized, prepareLocalized) ->

    BaseControlWrapper = Marionette.ItemView.extend
        initialize: (options) ->
            @getControlByType @model.get("controlType")

        getControlByType: (controlType) ->
            if controlType
                require [controlType], (control) =>
                    @addInnerControl(control)

        addInnerControl:(controlTypeView) ->
            @model.set {"context": @} unless @model.has "context"

            @childView = new controlTypeView
                model: @model

            @childView = _.extend(@childView, {localized: localized, prepareLocalized: prepareLocalized})

            @renderInnerControl @childView

        renderInnerControl: (view) ->
            @$el.html(view.render().el)