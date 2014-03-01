var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent", "hbs!templates/modules/footer/footerComponentTpl"], function(Marionette, BaseBlockController, BaseComponent, FooterComponentTpl) {
  var FooterController, _ref;
  return FooterController = (function(_super) {
    __extends(FooterController, _super);

    function FooterController() {
      _ref = FooterController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FooterController.prototype.initialize = function(options) {
      this.applyOptions(["region", "declaration"]);
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region,
        template: FooterComponentTpl
      });
    };

    FooterController.prototype.show = function() {
      return this.component.show();
    };

    FooterController.prototype.hide = function() {
      return this.region.close();
    };

    return FooterController;

  })(BaseBlockController);
});
