define ["marionette"
        "baseControl"
        "controls/combobox/controller/comboboxController"
        "comboboxListCollection"
        "inputTextControl"
        "dropDownListControl"
        "globalEvents"
        ], (Marionette, BaseControl, ComboboxController, ComboboxListCollection, InputTextControl, DropDownListControl, globalEvents) ->

    ComboboxView = BaseControl.extend
        template: "<div class='inputTextWrapper'></div>"

        className: "comboboxControl"

        regions:
            inputTextRegion: ".inputTextWrapper"
            # dropDownRegion:  not defined here, will be defined in renderingService workflow by declaration innerComponent buffer

        initialize: (options) ->
            @context = Marionette.getOption @, "context"
            @eventBus = _.extend {}, Backbone.Events

            @dataModel = Marionette.getOption @, "dataModel"

            @applyModelProperties([
                "name"
                "url"
                "startInputLength"
                # and two important models:
                "inputControlModel"
                "dropDownListControlModel"
            ], {prefix: @_attrPrefix})

            if !@_inputControlModel
                throw new Error "InputControlModel is not defined!"

            # for model patch
            # @see @patchInputTextModel
            @_inputControlModel.on "change", (model) =>
                @initTextInputView model
                @inputTextRegion.show @inputTextView

            @listCollection = new ComboboxListCollection()

            @initTextInputView @_inputControlModel

            if @_dropDownListControlModel
                @initDropDown()
              
            @controller = new ComboboxController
                inputName: @_name
                url: @_url
                input: @inputTextView

            _.bindAll @, 
                "onDropDownSelected",
                "onInputKeyUp", 
                "onListData",
                "onWidnowResized",
                "onHtmlClick"

            @eventBus.on "input:focus", @onInputFocus
            @eventBus.on "input:keyup", @onInputKeyUp

            @controller.on "listdata", @onListData

            # when item in list selected
            @on "option:selected", @onDropDownSelected

            # globalEvents works as service-singleton
            globalEvents.on "window:resize", @onWidnowResized
            globalEvents.on "html:click", @onHtmlClick

        onWidnowResized: (data) ->
            inputTop = @inputTextView.$el.offset().top
            inputHeight = @inputTextView.$el.height()

            height = data.height - (inputTop + inputHeight)
            @dropDown.setHeight(height)

        onHtmlClick: ->
            @dropDownRegion.close()

        initDropDown: () ->
            @selectionCompleted = false
            @dropDown = new DropDownListControl
                context: @
                model: @_dropDownListControlModel          
                collection: @listCollection

        initTextInputView: (model) -> 
            @inputTextView = new InputTextControl
                context: @context
                model: model
                dataModel: @dataModel
                eventBus: @eventBus

        onRender: ->
            # input we must show anyway
            @inputTextRegion.show @inputTextView

        onInputKeyUp: (data) ->
            val = data.value
            if val.length >= @_startInputLength
                @controller.doSearch val
            else
                @dropDownRegion.close()

        onListData: (data) ->
            @listCollection = data.collection
            # here we show list with autocomplete result options
            @dropDownRegion.reset()

            @initDropDown()

            @dropDownRegion.show @dropDown

        onDropDownSelected: (model) ->
            if model is "empty"
                # no data, event from dropDown emptyView
                @inputTextView.setFocus()
            else
                @selectionCompleted = true
                @displayResult model
                @returnData model
                # pass focus to next input via context

                @context.trigger "focus:next"

        displayResult: (model) ->
            # TODO: Handlebars needed?
            result = model.get "name"
            result += " " + model.get "country"  if model.has "country"

            if model.has "codeIata" or model.has "codeSirena"
                result += " ("
                result += model.get "codeIata"  if model.has "codeIata"
                result += " " + model.get "codeSirena"  if model.has "codeSirena"
                result += ")"

            @inputTextView.setValue(result)

        setInputValue: (val) ->
            @inputTextView.setValue(val)

        # result data function
        # TODO: a bit poorly: mess with conception about this model arg and dataModel of input. 
        # at any case, we must return data from onDropDownSelected function
        returnData: (model) ->
            @context.trigger "collect:data", model

        # sometimes we need to pass value to input text view
        patchInputTextModel: (property, value) ->
            @_inputControlModel.set property, value

        dropDownSelectedImitation: (data) ->
            @onDropDownSelected data.model

        # public api provider
        publicApi: () ->
            return {
                # when needed to add (change) @_inputControlModel property and rerender input text view
                "patchInputTextModel": @patchInputTextModel
                # for experiments and selection imitation in form stats controller
                "dropDownSelectedImitation": @dropDownSelectedImitation
            }