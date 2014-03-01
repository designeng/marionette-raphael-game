var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent"], function(Marionette, BaseBlockController, BaseComponent) {
  var GameWrapperController, _ref;
  return GameWrapperController = (function(_super) {
    __extends(GameWrapperController, _super);

    function GameWrapperController() {
      _ref = GameWrapperController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GameWrapperController.prototype.initialize = function(options) {
      this.applyOptions(["region", "declaration"]);
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region,
        template: ""
      });
    };

    GameWrapperController.prototype.show = function() {
      return this.component.show();
    };

    GameWrapperController.prototype.hide = function() {
      return this.region.close();
    };

    return GameWrapperController;

  })(BaseBlockController);
});
