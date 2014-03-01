define(["backbone"], function(Backbone) {
  var controlContainerService;
  if (typeof controlContainerService === "undefined" || controlContainerService === null) {
    return controlContainerService = new Backbone.ChildViewContainer();
  }
});
