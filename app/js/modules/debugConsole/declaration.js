define(["marionette", "boxModel"], function(Marionette, BoxModel) {
  var declaration;
  return declaration = {
    componentItems: [
      {
        controlType: "boxControl",
        controlModel: new BoxModel({
          text: "FORM DATA HERE",
          className: "formDataCollector"
        })
      }
    ]
  };
});
