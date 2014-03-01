define(["backbone"], function(Backbone) {
  var DropDownListModel;
  DropDownListModel = Backbone.Model.extend({
    defaults: {
      display: false,
      setFirstActive: true
    }
  });
  return DropDownListModel;
});
