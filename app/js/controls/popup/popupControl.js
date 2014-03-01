define(["backbone", "marionette", "core/ioc/startComponentInRegion", "buttonControl", "buttonModel", "globalEvents", "hbs!templates/modules/popup/defaultTpl"], function(Backbone, Marionette, startComponentInRegion, ButtonControl, ButtonModel, globalEvents, defaultTpl) {
  var PopupRegion, PopupView;
  PopupRegion = Marionette.Region.extend({
    initialize: function() {
      return this.el = Marionette.getOption(this, "el");
    }
  });
  return PopupView = Marionette.Layout.extend({
    className: 'myPopup',
    template: function() {
      return this.getTemplate();
    },
    events: {
      "click .popupMask": "clickMask"
    },
    closeButtonModel: new ButtonModel({
      className: "closeButton",
      caption: "x",
      states: {
        "disabled": {},
        "default": {},
        "hover": {
          "className": "closeButtonHover"
        },
        "active": {
          "className": "closeButtonActive"
        }
      }
    }),
    regions: {
      maskWrapperRegion: ".popupMask",
      popupWrapperRegion: ".popupContentWrapper",
      contentWrapperRegion: ".popupContent",
      closeButtonWrapperRegion: ".popupClose"
    },
    initialize: function() {
      var modelProps;
      this.popupOpenState = false;
      this.globalPopupEventListen = false;
      modelProps = ["className", "height", "width", "borderColor", "content", "centeringWidthPosition", "centeringHeightPosition", "wrapperClassName", "closeButton", "typeRendering", "mask", "el"];
      this.applyModelProperties(modelProps, {
        prefix: this._attrPrefix
      });
      this.initCloseButton();
      return startComponentInRegion.call(this, this._content, this.contentWrapperRegion);
    },
    getTemplate: function() {
      if (this.model.get('template')) {
        return this.model.get('template');
      } else {
        return defaultTpl;
      }
    },
    changeParamState: function(paramName, state) {
      if (state) {
        return this[paramName] = true;
      } else {
        return this[paramName] = false;
      }
    },
    initCloseButton: function() {
      var CloseButton,
        _this = this;
      CloseButton = ButtonControl.extend({
        model: Marionette.getOption(this, "closeButtonModel"),
        onClick: function(e) {
          return _this.closePopup();
        }
      });
      return this.closeButton = new CloseButton;
    },
    clickMask: function() {
      return this.closePopup();
    },
    onRender: function() {
      this.setStyle();
      if (this._closeButton) {
        return this.addCloseButton();
      }
    },
    setStyle: function() {
      var $popupContent;
      $popupContent = this.$el.find(this.popupWrapperRegion.el);
      return $popupContent.css({
        width: this._width,
        left: this._centeringWidthPosition ? '50%' : void 0,
        marginLeft: this._centeringWidthPosition ? this._width / 2 * (-1) : void 0,
        height: this._height,
        top: this._centeringHeightPosition ? '50%' : void 0,
        marginTop: this._centeringHeightPosition ? this._height / 2 * (-1) : void 0
      });
    },
    addCloseButton: function() {
      var $popupContentClose, closeButtonControlEl;
      closeButtonControlEl = this.closeButton.render().$el;
      $popupContentClose = this.$el.find(this.closeButtonWrapperRegion.el);
      return $popupContentClose.html(closeButtonControlEl);
    },
    closePopup: function() {
      var _this = this;
      if (this.popupOpenState) {
        this.trigger('popupClose:start');
        this.toggleAddGlobalClick(false);
        return this.$el.fadeOut('fast', function() {
          _this.maskWrapperRegion.close();
          _this.contentWrapperRegion.close();
          $('.' + _this._wrapperClassName).remove();
          _this.changeParamState('popupOpenState', false);
          return _this.trigger('popupClose:finish');
        });
      }
    },
    show: function() {
      this.toggleAddGlobalClick(true);
      if (!this.popupOpenState) {
        this.defineRegion();
        return this.showRegion();
      } else {
        return this.closePopup();
      }
    },
    defineRegion: function() {
      var $popupWrapper, popupRegion;
      $popupWrapper = this.getPopupWrapper();
      $popupWrapper.append("<div class='" + this._wrapperClassName + "'></div>");
      popupRegion = new PopupRegion({
        el: "." + this._wrapperClassName
      });
      return this.addRegion("popupRegion", popupRegion);
    },
    showRegion: function() {
      this.regionManager.get("popupRegion").show(this);
      return this.changeParamState('popupOpenState', true);
    },
    getPopupWrapper: function() {
      if (this._typeRendering) {
        switch (this._typeRendering) {
          case 'inside':
            return this._el.parent();
          case 'outside':
            return $('.pageLayout');
        }
      } else {
        return console.error("PopupControl. typeRendering param not exist");
      }
    },
    toggleAddGlobalClick: function(state) {
      if (state) {
        this.toggleBindGlobalClick(true);
        return globalEvents.addHtmlEvent(this._wrapperClassName);
      } else {
        this.toggleBindGlobalClick(false);
        return globalEvents.removeHtmlEvent(this._wrapperClassName);
      }
    },
    toggleBindGlobalClick: function(state) {
      var _this = this;
      if (state) {
        return globalEvents.on(this._wrapperClassName, function(el) {
          if (_this.popupOpenState && _this.globalPopupEventListen) {
            if (!$(el.target).closest('.' + _this._wrapperClassName).length) {
              return _this.closePopup();
            }
          } else {
            return _this.changeParamState('globalPopupEventListen', true);
          }
        });
      } else {
        return globalEvents.off(this._wrapperClassName);
      }
    }
  });
});
