var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent", "hbs!templates/modules/header/headerComponentTpl"], function(Marionette, BaseBlockController, BaseComponent, headerComponentTpl) {
  var HeaderController, _ref;
  return HeaderController = (function(_super) {
    __extends(HeaderController, _super);

    function HeaderController() {
      _ref = HeaderController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderController.prototype.initialize = function(options) {
      this.applyOptions(["region", "declaration"]);
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region,
        template: headerComponentTpl
      });
    };

    HeaderController.prototype.show = function() {
      return this.component.show();
    };

    HeaderController.prototype.hide = function() {
      return this.region.close();
    };

    return HeaderController;

  })(BaseBlockController);
});
