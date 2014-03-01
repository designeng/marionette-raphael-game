define [
    "backbone"
    "marionette"
    "core/ioc/startComponentInRegion" 
    "buttonControl"
    "buttonModel"
    "globalEvents"
    "hbs!templates/modules/popup/defaultTpl"
], (Backbone, Marionette, startComponentInRegion, ButtonControl, ButtonModel, globalEvents, defaultTpl) -> 

    PopupRegion = Marionette.Region.extend
        initialize: ->
            @el = Marionette.getOption @, "el"

    return PopupView = Marionette.Layout.extend
        # globalPopupEvent: 'windowPopupClick'

        className: 'myPopup'

        template: ->
            return @getTemplate()

        events:
            "click .popupMask" : "clickMask"

        closeButtonModel: new ButtonModel
            className: "closeButton"
            caption: "x"
            states:
                "disabled"  :{}
                "default"   :{}
                "hover"     :{"className": "closeButtonHover"}
                "active"    :{"className": "closeButtonActive"}

        regions:
            maskWrapperRegion       : ".popupMask"
            popupWrapperRegion      : ".popupContentWrapper"
            contentWrapperRegion    : ".popupContent"
            closeButtonWrapperRegion: ".popupClose"

        initialize: ->
            # @eventBus = Marionette.getOption @, "eventBus"

            @popupOpenState = false

            @globalPopupEventListen = false

            modelProps = [
                "className"
                "height"
                "width"
                "borderColor"
                "content"
                "centeringWidthPosition"
                "centeringHeightPosition"
                "wrapperClassName"
                "closeButton"
                "typeRendering"
                "mask"
                "el"
            ]
            @applyModelProperties(modelProps, {prefix: @_attrPrefix})

            @initCloseButton()

            startComponentInRegion.call(@, @_content, @contentWrapperRegion)

        getTemplate: ->
            if @model.get('template') then return @model.get('template') else return defaultTpl

        changeParamState: (paramName, state) ->
            if state
                @[paramName] = true
            else
                @[paramName] = false

        initCloseButton: ->
            CloseButton = ButtonControl.extend
                model: Marionette.getOption @, "closeButtonModel"
                onClick: (e) =>
                    @closePopup()
            @closeButton = new CloseButton

        clickMask: ->
            @closePopup()

        onRender: ->
            @setStyle()
            @addCloseButton() if @_closeButton

        setStyle: ->
            $popupContent = @$el.find(@popupWrapperRegion.el)
            $popupContent.css
                width: @_width
                left: '50%' if @_centeringWidthPosition
                marginLeft: @_width/2*(-1) if @_centeringWidthPosition

                height: @_height
                top: '50%' if @_centeringHeightPosition
                marginTop: @_height/2*(-1) if @_centeringHeightPosition

        addCloseButton: ->
            closeButtonControlEl = @closeButton.render().$el
            $popupContentClose = @$el.find(@closeButtonWrapperRegion.el)
            $popupContentClose.html(closeButtonControlEl)

        closePopup: ->
            if @popupOpenState
                @trigger('popupClose:start')
                @toggleAddGlobalClick(false)

                @$el.fadeOut 'fast', =>
                    @maskWrapperRegion.close()
                    @contentWrapperRegion.close()
                    $('.' + @_wrapperClassName).remove()
                    @changeParamState('popupOpenState', false)
                    @trigger('popupClose:finish')

        show: ->
            @toggleAddGlobalClick(true)

            unless @popupOpenState
                @defineRegion()
                @showRegion()
            else
                @closePopup()

        defineRegion: ->
            $popupWrapper = @getPopupWrapper()
            $popupWrapper.append("<div class='#{@_wrapperClassName}'></div>")
            popupRegion = new PopupRegion
                el: "." + @_wrapperClassName
            @addRegion "popupRegion", popupRegion

        showRegion: ->
            @regionManager.get("popupRegion").show( @ )
            @changeParamState('popupOpenState', true)

        getPopupWrapper: ->
            if @_typeRendering
                return switch @_typeRendering
                    when 'inside'  then @_el.parent()
                    when 'outside' then $('.pageLayout')
            else
                console.error("PopupControl. typeRendering param not exist")

        toggleAddGlobalClick: (state) ->
            if state
                @toggleBindGlobalClick(true)
                globalEvents.addHtmlEvent( @_wrapperClassName )
            else
                @toggleBindGlobalClick(false)
                globalEvents.removeHtmlEvent( @_wrapperClassName )

        toggleBindGlobalClick: (state) ->
            if state
                globalEvents.on @_wrapperClassName, (el) =>
                    if @popupOpenState and @globalPopupEventListen
                        unless $(el.target).closest('.' + @_wrapperClassName).length
                            @closePopup() 
                    else
                        @changeParamState('globalPopupEventListen', true)
            else
                globalEvents.off @_wrapperClassName
