define ["backbone"
        "marionette"
        "baseViewObject"
        "baseLayoutObject"
        "baseControllerObject"
        "backbone.validation"
], (Backbone, Marionette, BaseViewObject, BaseLayoutObject, BaseControllerObject) ->

    _.extend(Marionette.View::, BaseViewObject)
    _.extend(Marionette.Layout::, BaseLayoutObject)
    _.extend(Marionette.Controller::, BaseControllerObject)

    # Backbone extentions
    _.extend(Backbone.Model::, Backbone.Validation.mixin)

    # TODO: add input text placeholder

    # jquery val reload
    # $.fn.realVal = $.fn.val
    # $.fn.val = ->
    #     elem = $(this)
    #     if arguments.length > 0
    #         newVal = elem.realVal.apply(this, arguments)
    #         elem.trigger "val.placeholder"
    #         return newVal
    #     (if (elem.data("placeholder") and elem.hasClass("placeholder")) then "" else elem.realVal())

    # $.fn.extend({
    #     # usage"
    #     # $(':input[data-placeholder]').placeholder()
    #     placeholder: ->
    #         $(this).each ->
    #             $field = $(this)
    #             $field.blur(->
    #                 $field.realVal($field.data("placeholder")).addClass "placeholder"  if $field.realVal() is ""
    #             ).focus(->
    #                 $field.realVal("").removeClass "placeholder"  if $field.hasClass("placeholder")
    #             ).on("val.placeholder", ->
    #                 $field.removeClass "placeholder"  if $field.realVal() isnt ""
    #             ).blur()
    # })
    
    # jquery
    
    $.fn.focusNextInputField = ->
        @each ->
            fields = $(this).parents("form:eq(0),body").find("button,input,textarea,select")
            index = fields.index(this)
            fields.eq(index + 1).focus()  if index > -1 and (index + 1) < fields.length
            false