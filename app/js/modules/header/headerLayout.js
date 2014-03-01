(function() {
  define(["marionette", "navigationBarControl", "hbs!templates/modules/header/headerLayoutTpl"], function(Marionette, NavigationBarControl, headerLayoutTpl) {
    var HeaderLayout;
    return HeaderLayout = Marionette.Layout.extend({
      template: headerLayoutTpl,
      className: "headerLayout",
      regions: {},
      initialize: function() {}
    });
  });

}).call(this);
