var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette"], function(Marionette) {
  var BaseBlockController, _ref;
  return BaseBlockController = (function(_super) {
    __extends(BaseBlockController, _super);

    function BaseBlockController() {
      _ref = BaseBlockController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseBlockController.prototype.getComponent = function() {
      return this.component;
    };

    return BaseBlockController;

  })(Marionette.Controller);
});
