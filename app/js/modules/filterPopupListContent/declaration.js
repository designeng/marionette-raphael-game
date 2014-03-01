define(["hbs!templates/modules/filter/filterWrapperTpl"], function(SiteInfoTpl) {
  var declaration, siteInfoModel;
  siteInfoModel = new Backbone.Model({
    className: "textedTextInfo",
    tpl: SiteInfoTpl
  });
  return declaration = {
    componentModel: new Backbone.Model({
      rootClass: "textStats",
      itemClasses: ["textedText"]
    }),
    componentItems: [
      {
        controlType: "filterPopupList",
        controlModel: siteInfoModel
      }
    ]
  };
});
