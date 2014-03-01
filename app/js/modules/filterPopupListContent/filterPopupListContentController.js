var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent"], function(Marionette, BaseBlockController, BaseComponent) {
  var FilterPopupListContentController, _ref;
  return FilterPopupListContentController = (function(_super) {
    __extends(FilterPopupListContentController, _super);

    function FilterPopupListContentController() {
      _ref = FilterPopupListContentController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FilterPopupListContentController.prototype.initialize = function(options) {
      this.region = Marionette.getOption(this, "region");
      this.declaration = Marionette.getOption(this, "declaration");
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region
      });
    };

    FilterPopupListContentController.prototype.show = function() {
      this.component.show();
      return this.triggerMethod("show");
    };

    FilterPopupListContentController.prototype.close = function() {
      return this.component.close();
    };

    return FilterPopupListContentController;

  })(BaseBlockController);
});
