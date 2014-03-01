define [
    "core/utils/locale/prepareLocalized"
    "core/utils/view/applyModelPropertiesToViewProperties"
    "core/utils/options/applyOptions"
    "i18n!nls/general"
], (prepareLocalized, applyModelProperties, applyOptions, localized, asEventStream) ->

    return BaseViewObject = {

        _attrPrefix: "_"

        localized: localized

        prepareLocalized: prepareLocalized

        defaultClassName: (name) ->
            if @model.has "className"
                return @model.get "className"
            else
                return name

        applyModelProperties: (properties, options) ->
            applyModelProperties.call @, properties, options

        applyOptions: (options, opt) ->
            applyOptions.call @, options, opt
    }