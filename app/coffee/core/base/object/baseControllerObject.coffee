define [
    "core/utils/options/applyOptions"
    "i18n!nls/general"
    "core/utils/locale/prepareLocalized"
    "core/utils/frp/asEventStream"
], (applyOptions, localized, prepareLocalized, asEventStream) ->

    BaseControllerObject = {
        localized: localized

        prepareLocalized: prepareLocalized

        applyOptions: (options, opt) ->
            applyOptions.call @, options, opt

        # add frp support to Controller
        asEventStream: (eventName, eventTransformer) ->
            asEventStream.call @, eventName, eventTransformer
    }

    return BaseControllerObject