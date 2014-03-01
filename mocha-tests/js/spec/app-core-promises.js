var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["when", "marionette", "AppSpec", "PromisesSrc", "DeffSrc", "moduleHash"], function(WhenP, Marionette, appSpec, PromisesSrc, DeffSrc, moduleHash) {
  var AppCorePromises, appCorePromises, _ref;
  AppCorePromises = (function(_super) {
    __extends(AppCorePromises, _super);

    function AppCorePromises() {
      _ref = AppCorePromises.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AppCorePromises.prototype.initialize = function() {
      appSpec.setSpec(this);
      this.headerPromise = moduleHash.getModuleAsPromise("header");
      this.footerPromise = moduleHash.getModuleAsPromise("footer");
      return this.triggerMethod("init");
    };

    AppCorePromises.prototype.onInit = function() {
      return describe("Header", function() {
        before(function() {
          return this.spec = appSpec.getSpec();
        });
        after(function() {
          this.spec.triggerMethod("footer");
          return window.location.href = "/mocha-tests/test2.html#!/footer";
        });
        this.timeout(3000);
        Given(function(done) {
          return this.spec.setPromise(this.spec.headerPromise, this, "result", done);
        });
        Then(function() {
          return expect(this.result).to.be.an("object");
        });
        And(function() {
          return expect(this.result).property("declaration");
        });
        And(function() {
          return expect(this.result.declaration.componentItems).to.have.length(2);
        });
        return And(function() {
          return expect(this.result).property("triggerMethod");
        });
      });
    };

    AppCorePromises.prototype.onFooter = function() {
      return describe("Footer", function() {
        after(function() {
          return delete this.spec;
        });
        this.timeout(3000);
        Given(function(done) {
          return this.spec.setPromise(this.spec.footerPromise, this, "result", done);
        });
        Then(function() {
          return expect(this.result).to.be.an("object");
        });
        And(function() {
          return expect(this.result).property("declaration");
        });
        And(function() {
          return expect(this.result.declaration.componentItems).to.be.an('array');
        });
        And(function() {
          return expect(this.result.declaration.componentItems).to.have.length(7);
        });
        return And(function() {
          return expect(this.result).property("triggerMethod");
        });
      });
    };

    return AppCorePromises;

  })(Marionette.Controller);
  appCorePromises = new AppCorePromises();
  return appCorePromises;
});
