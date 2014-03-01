var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "baseBlockController", "baseComponent", "hbs!templates/modules/footer/footerInnerComponentTpl"], function(Marionette, BaseBlockController, BaseComponent, FooterInnerComponentTpl) {
  var FooterInnerController, _ref;
  return FooterInnerController = (function(_super) {
    __extends(FooterInnerController, _super);

    function FooterInnerController() {
      _ref = FooterInnerController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FooterInnerController.prototype.initialize = function(options) {
      this.applyOptions(["region", "declaration"]);
      return this.component = new BaseComponent({
        declaration: this.declaration,
        context: this,
        region: this.region,
        template: FooterInnerComponentTpl
      });
    };

    FooterInnerController.prototype.show = function() {
      return this.component.show();
    };

    FooterInnerController.prototype.hide = function() {
      return this.region.close();
    };

    return FooterInnerController;

  })(BaseBlockController);
});
