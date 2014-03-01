define [
    "backbone"
    "marionette"
    "baseActiveKey"
    "globalEvents"
    "controlContainerService"
    "inputError"
    "controls/switch/init/bindKeyMethods"
    "core/utils/view/applyModelProperties"
    "core/utils/aspect/defineCommonAspect"
], (Backbone,
    Marionette, 
    BaseActiveKey,
    globalEvents,
    controlContainerService,
    InputErrorControl,
    bindKeyMethods,
    applyModelProperties,
    defineCommonAspect
    ) -> 

    NoItemsView = Marionette.ItemView.extend
        template: 'No options'

    SwitchItemView = Marionette.ItemView.extend
        template: '<input type="radio" name="{{inputName}}"/><label for="{{inputName}}">{{inputNameValue}}</label>'

        className: ->
            @defaultClassName("switchControlItem")

        templateHelpers:
            inputName: ->
                unless name = @name
                    _.uniqueId "radio_"
                else
                    # @name must be object anyway
                    if _.isString @name
                        _name = @name
                        @name = {}
                        @name[_name] = _name
                    keys = _.keys @name
                    return keys[0].toLowerCase()
            inputNameValue: ->
                unless name = @name
                    _.uniqueId("radio_") + "_Value" 
                else
                    keys = _.keys @name
                    return @name[keys[0]]

        events:
            "click"         : "onClick"
            "focus :input"  : "onInputFocus"
            "blur :input"   : "onInputBlur"

        _attrPrefix: ""

        initialize: ->
            @applyModelProperties([
                "itemSelectedClass"
                "itemFocusedClass"
                ], {prefix: @_attrPrefix})

        onRender: ->
            @input = @$el.find("input")
            @label = @$el.find("label")

            @index  = @model.get "index"

            _.bindAll @, "onInputFocus"

            if @index != 0
                @input.remove()

            @$el.addClass("item#{@index}")

        onClick: ->
            @check()
            # uncheck others
            @trigger "checked"

        check: ->
            @input.attr "checked", "checked"
            @label.addClass @itemSelectedClass
            @label.removeClass @itemFocusedClass

        unCheck: ->
            @input.removeAttr("checked")
            @label.removeClass @itemSelectedClass
            @label.removeClass @itemFocusedClass

        onInputFocus: ->
            if @index == 0
                @trigger "infocus", @index
            @label.addClass @itemFocusedClass

        onInputBlur: ->
            if @index == 0
                @trigger "inblur"
            @label.removeClass @itemFocusedClass
                

    SwitchControlView = BaseActiveKey({BaseObject: Marionette.CompositeView}).extend

        className: (res) ->
            @defaultClassName("switchControl")

        itemView: SwitchItemView

        emptyView: NoItemsView

        initialize: (options) ->
            @context = Marionette.getOption @, "context"

            @eventBus = _.extend {}, Backbone.Events
            
            applyModelProperties.call(@, @model,
                "width"
                "height"
                "fontSize" 
                "inputOptions"
                "itemClassName"
                "itemFocusedClass"
                "itemSelectedClass"
                "showInputs"
                "startIndex"
                        {prefix: @_attrPrefix})

            @collection = new Backbone.Collection()

            @_removers = []
            @_keyEvents = ["up", "down", "left", "right", "space", "tab"]
            bindKeyMethods.call(@)

            # create method and reload it afterwords
            for evt in @_keyEvents
                methodName = @_getMethodName evt

                if !@[methodName]
                    @[methodName] = (e) =>
                        # blank funcion
                        # console.log "RELOAD THIS METHOD IN YOUR REALIZATION"

                remover = defineCommonAspect.call(@, methodName, "afterKeyPressed", "after")
                @_removers.push remover # remember all aspects here to remove in "beforeClose" view method

            @on "itemview:checked", @onItemClick
            @on "itemview:infocus", @onInFocus
            @on "itemview:inblur", @onInBlur

            @inFocus = false

            _.bindAll @, "onHtmlClick"
            globalEvents.on "html:click", @onHtmlClick

            # inputError can be find by "inputErrorHandlerCid" as inputError for textInputControl
            if @model.has "inputErrorHandlerCid"
                @inputError = controlContainerService.findByCid(@model.get "inputErrorHandlerCid")
            else
                @inputError = new InputErrorControl(
                        model: new Backbone.Model()                    
                    )

        onBeforeRender: -> 
            # result as object
            @_inputOptionsPrepared = @prepareLocalized(@_inputOptions, "object")

            modIndex = 0

            for option in @_inputOptionsPrepared
                optionModel = new Backbone.Model(
                        name: option
                        eventBus: @eventBus
                        itemSelectedClass: @_itemSelectedClass
                        itemFocusedClass: @_itemFocusedClass
                        index: modIndex++
                    )
                @collection.add optionModel

            if @collection.length
                @currentIndex = 0

        onRender: -> 
            @hideInputs() unless @_showInputs

            _.each @_keyEvents, (evt) =>          
                @keyOn evt, @_bindKeyEventToMethod(@_getMethodName evt)

            @dataModel = Marionette.getOption @, "dataModel"

            @dataModel.bind "validated", (isValid, model, errors) =>
                if !isValid 
                    console.log "NOT VALID"                 
                else
                    @context.trigger "collect:data", @dataModel

            if _.isNumber @_startIndex
                @chooseItem @_startIndex

        onHtmlClick: (e) ->
            if $.contains @el, e.target
                @onInsideClick()                    
            else
                @onOutClick()

        hideInputs: ->
            @children.each((item) =>
                    # input must participate in bypassing form by "tab" key pressing
                    # do not disactivate input if index = 0 - add class with "opacity", "0"
                    if item.model.get("index") == 0
                        item.input.addClass "switchItemInput__hidden"
                    else
                        # .hide means disactivation - disactivate input
                        item.input.hide()
                )
        
        # inFocus value manipulations
        onInFocus: (index) ->
            @inFocus = true
            
        onInBlur: ->
            @inFocus = false

        onInsideClick: ->
            @inFocus = true

        onOutClick: ->
            @inFocus = false

        onItemClick: (itemview) ->
            @inFocus = true
            @currentIndex = itemview.model.get "index"            

            @chooseItem @currentIndex

        # works as after-aspect with all key handlers (see bindKeyMethods)
        afterKeyPressed: (key) ->
            if !@inFocus
                return

            if key is "space"
                @chooseItem @currentIndex

            if key is "left" or key is "up" 
                @choosePrevious()

            if key is "down" or key is "right"
                @chooseNext()

        choosePrevious: ->
            if @currentIndex > 0
                @chooseItem --@currentIndex

        chooseNext: ->
            if @currentIndex < @collection.length - 1
                @chooseItem ++@currentIndex 

        chooseItem: (index) ->
            if _.isNumber @checkedItemIndex
                @children.findByIndex(@checkedItemIndex).unCheck()

            item = @children.findByIndex index
            item.check()

            @checkedItemIndex = index

            @dataModel.set "name", @model.get "name"
            @dataModel.set "data", _.keys(item.model.get("name"))[0]

            # or not collect this control data?
            @context.trigger "collect:data", @dataModel

            # @dataModel.validate()

            @context.trigger "switch:selected", @dataModel.get("data")

            return item

        # but it does not called anywhen on route change... TODO: to think 
        onClose: ->
            _.each @_keyEvents, (evt) =>
                @keyOff evt  

        _getMethodName: (string) ->
            return "on" + _.str.classify.call(@, string)

        _bindKeyEventToMethod: (methodName) ->
            return @[methodName]
