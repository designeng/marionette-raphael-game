var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent", "appinstance"], function(Marionette, BaseBlockController, BaseComponent, App) {
  var PopupDevController, _ref;
  return PopupDevController = (function(_super) {
    __extends(PopupDevController, _super);

    function PopupDevController() {
      _ref = PopupDevController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupDevController.prototype.initialize = function(options) {
      this.region = Marionette.getOption(this, "region");
      this.declaration = Marionette.getOption(this, "declaration");
      if (this.declaration.componentModel.get('componentType') === "popup") {
        $('.pageContainer').append('<div class="popup"></div>');
        App.addRegions({
          popupRegion: ".popup"
        });
        this.region = App.popupRegion;
      }
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region
      });
    };

    PopupDevController.prototype.show = function() {
      return this.triggerMethod("show");
    };

    PopupDevController.prototype.close = function() {
      return this.component.close();
    };

    PopupDevController.prototype.onShow = function() {
      this.component.show();
      return this.region.$el.show();
    };

    PopupDevController.prototype.onHide = function() {
      var _this = this;
      return this.region.$el.fadeOut('fast', function() {
        return _this.region.close();
      });
    };

    return PopupDevController;

  })(BaseBlockController);
});
