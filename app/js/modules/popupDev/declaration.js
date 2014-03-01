define(["hbs!templates/modules/footer/siteInfoTpl"], function(SiteInfoTpl) {
  var declaration, popupControllModelOutside, popupModel;
  popupModel = new Backbone.Model({
    rootClass: "popupDevelopment",
    itemClasses: ["popup"],
    componentType: "popup"
  });
  popupControllModelOutside = new Backbone.Model({
    className: "popupControl",
    width: 600,
    height: 400,
    centeringWidthPosition: true,
    centeringHeightPosition: true,
    borderColor: "black",
    content: "popupDevContent",
    closeButton: true,
    mask: true
  });
  return declaration = {
    componentModel: popupModel,
    componentItems: [
      {
        controlType: "popupControl",
        controlModel: popupControllModelOutside
      }
    ]
  };
});
