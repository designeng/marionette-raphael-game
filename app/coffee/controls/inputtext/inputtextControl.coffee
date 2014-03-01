define [
    "marionette"
    "baseInput"
    "inputError"
    "hbs!templates/control/inputText/inputTextTpl"
    "jquery.maskedinput"
    "jquery.placeholder"
], (Marionette, BaseInput, InputErrorControl, inputTextTpl) ->

    return InputTextView = BaseInput.extend

        template: ->
            return inputTextTpl

        events:
            "click"             : "onClick"
            "keyup :input"      : "onKeyUp"
            "change :input"     : "onChange"
            "focus :input"      : "onFocus"
            "blur :input"       : "onBlur"
            "mouseover :input"  : "onOver"
            "mouseout :input"   : "onOut"
            "mouseout :input"   : "onOut"

        initialize: (options) ->
            BaseInput::initialize.call @

            @dataModel = @getDataModel()
            @context = Marionette.getOption @, "context"
            @applyProperties()
            @currentValue = ""
            @eventBus = eventBus if eventBus = Marionette.getOption @, "eventBus"
            @name = @getInputName()

        applyProperties: -> 
            applyProperties = [
                "value"
                "disabled"
                "disabledClassName"
                "states"
                "mask"
                "placeHolder"
                "isValidValue"
                "inputErrorHandlerCid"
            ]
            @applyModelProperties(applyProperties, {prefix: @_attrPrefix})

        getDataModel: ->
            unless model = Marionette.getOption @, "dataModel"
                throw new Error "View option or model property 'dataModel' is not defined!"
            return model

        getInputName: ->
            if name = @dataModel.get "inputName"
                return name
            else if name = @model.get "name"
                @dataModel.set "inputName", name
                return name

        onRender: -> 
            @input = @$el.find("input")
            @setValueAfterRender()

            @input.mask @_mask if @_mask

            @addRegion("hintRegion", ".hintWrapper") if @hint

            if @_disabled
                @input.prop("disabled", true)
                @_isInputDisabled = true

            @bindAfterRender()
            @setState('passive')
            @inputErrorInit()

        setValueAfterRender: ->
            return  if @_value then @setValue @_value  else @setPlaceholder()

        bindAfterRender: ->
            @dataModel.on "change", (model) =>                                              # the place for transition this model to form, where it will be stored in special data-collection
                @context.trigger "input:data", {model: model}

            @dataModel.on "validated", (isValid, model, errors) =>
                unless isValid
                    @setState "invalid", errors
                else
                    @setState "valid"
                    @context.trigger "collect:data", @dataModel                             # and send this dataModel to form controll collection

        setPlaceholder: (text) ->
            return @input.addClass('placeholder').val(@prepareLocalized(@_placeHolder, "string")) if @_placeHolder

        removePlaceholder: ->
            return @input.removeClass('placeholder') if @_placeHolder

        onBlur: ->
            return @setPlaceholder() unless @getValue().length

        onOver: ->
            return @hintRegion.show @hint if @hint

        onOut: ->
            return @hintRegion.close() if @hint

        onClick: ->
            return unless @_isInputDisabled then @resetValue()

        onFocus: ->
            return unless @_isInputDisabled then @resetValue()

        onKeyUp: (e) ->
            inputValue = $.trim($(e.currentTarget).val())

            return @inputError.hide() if inputValue == ""

            unless @currentValue == inputValue
                @currentValue = inputValue
                @setDataModelValue(inputValue)
                @dataModel.validate() unless @_isValidValue
                @eventBus.trigger("input:keyup",{value: @currentValue}) if @eventBus

        onChange: ->
            return @dataModel.validate() if @_isValidValue

        inputErrorInit: ->                                                                  # error reporting attached for this input only if "inputErrorHandlerCid" is not specificated om model otherwise use existing view with inputErrorHandlerCid
            unless @_inputErrorHandlerCid
                @$el.find(".inputErrorWrapper").replaceWith @inputError.render().$el
                @inputError.hide()

        resetValue: ->
            @setState "valid"
            @currentValue = ""
            @setDataModelValue @currentValue
            @input.val(@currentValue)

            @setState "active"
            @removePlaceholder()

        setState: (state, errors) ->
            if state == "invalid"
                @input.addClass @_states[state]["className"]
                @inputError.show(errors)
            else if state == "valid"
                @input.removeClass @_states["invalid"]["className"]
                @inputError.hide()
            else if state == "passive"
                @input.addClass("inputPlaceHolder")
            else if state == "active"
                @input.removeClass("inputPlaceHolder")

        setValue: (val) ->                                                                  # public - can be called from combobox control, for ex.
            @currentValue = val
            @setDataModelValue @currentValue
            @input.val(@currentValue)

        setDataModelValue: (val) ->
            return @dataModel.set "data", val

        getValue: ->
            return String(@input.val())

        getStates: ->
            return String(@_states)

        isEmpty: ->
            return !$.trim(@input.val())

        setFocus: ->
            @input.focus()
