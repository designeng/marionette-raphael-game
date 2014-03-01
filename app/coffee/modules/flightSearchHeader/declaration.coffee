define [
    "hbs!templates/modules/footer/siteInfoTpl"
], (SiteInfoTpl)->

    siteInfoModel = new Backbone.Model
        className: "flightStatsTitle"
        tpl: 'Статус рейса'

    return declaration =
        componentItems: [
            { controlType: "simpleTplControl", controlModel: siteInfoModel }
        ]