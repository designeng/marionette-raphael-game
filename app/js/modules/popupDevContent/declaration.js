define(["hbs!templates/modules/footer/siteInfoTpl"], function(SiteInfoTpl) {
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
        controlType: "simpleTplControl",
        controlModel: siteInfoModel
      }
    ]
  };
});
