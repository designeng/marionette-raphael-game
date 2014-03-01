var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent"], function(Marionette, BaseBlockController, BaseComponent) {
  var PopupDevContentController, _ref;
  return PopupDevContentController = (function(_super) {
    __extends(PopupDevContentController, _super);

    function PopupDevContentController() {
      _ref = PopupDevContentController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PopupDevContentController.prototype.initialize = function(options) {
      this.region = Marionette.getOption(this, "region");
      this.declaration = Marionette.getOption(this, "declaration");
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region
      });
    };

    PopupDevContentController.prototype.show = function() {
      this.component.show();
      return this.triggerMethod("show");
    };

    PopupDevContentController.prototype.close = function() {
      return this.component.close();
    };

    return PopupDevContentController;

  })(BaseBlockController);
});
