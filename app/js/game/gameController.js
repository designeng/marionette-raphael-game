var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent"], function(Marionette, BaseBlockController, BaseComponent) {
  var GameController, _ref;
  return GameController = (function(_super) {
    __extends(GameController, _super);

    function GameController() {
      _ref = GameController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GameController.prototype.initialize = function(options) {
      this.applyOptions(["region", "declaration"]);
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region,
        template: ""
      });
    };

    GameController.prototype.show = function() {
      return this.component.show();
    };

    GameController.prototype.hide = function() {
      return this.region.close();
    };

    return GameController;

  })(BaseBlockController);
});
