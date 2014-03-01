var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["when", "marionette", "AppSpec", "PromisesSrc", "DeffSrc"], function(WhenP, Marionette, appSpec, PromisesSrc, DeffSrc) {
  var TestTest, testInstanse, _ref;
  TestTest = (function(_super) {
    __extends(TestTest, _super);

    function TestTest() {
      _ref = TestTest.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TestTest.prototype.initialize = function() {
      appSpec.setSpec(this);
      return this.triggerMethod("init");
    };

    TestTest.prototype.onInit = function() {
      return describe("Apple", function() {
        before(function() {
          this.spec = appSpec.getSpec();
          return this.prom = new DeffSrc();
        });
        after(function() {
          delete this.spec;
          return delete this.prom;
        });
        this.timeout(5000);
        Given(function(done) {
          return this.spec.setPromise(this.prom, this, "result", done);
        });
        Then(function() {
          return expect(this.result).to.be.a('object');
        });
        return And(function() {
          console.log(this.result);
          return expect(this.result).property("one");
        });
      });
    };

    return TestTest;

  })(Marionette.Controller);
  testInstanse = new TestTest();
  return testInstanse;
});
