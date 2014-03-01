define [
    "hbs!templates/modules/footer/siteInfoTpl"
], (SiteInfoTpl)->

    # site info
    siteInfoModel = new Backbone.Model
        className: "textedTextInfo"
        tpl: SiteInfoTpl

    return declaration =
        componentModel: new Backbone.Model(
            rootClass: "textStats"
            itemClasses: ["textedText"]
        )
        componentItems: [
            { controlType: "simpleTplControl", controlModel: siteInfoModel }
        ]
 