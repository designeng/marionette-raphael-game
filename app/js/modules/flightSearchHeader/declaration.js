define(["hbs!templates/modules/footer/siteInfoTpl"], function(SiteInfoTpl) {
  var declaration, siteInfoModel;
  siteInfoModel = new Backbone.Model({
    className: "flightStatsTitle",
    tpl: 'Статус рейса'
  });
  return declaration = {
    componentItems: [
      {
        controlType: "simpleTplControl",
        controlModel: siteInfoModel
      }
    ]
  };
});
