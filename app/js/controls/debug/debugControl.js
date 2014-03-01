(function() {
  define(["marionette"], function(Marionette) {
    var SpecialItemView;
    return SpecialItemView = Marionette.ItemView.extend({
      template: Handlebars.compile("<div class='item'>ITEM {{name}}</div>")
    });
  });

}).call(this);
