define [
    "hbs!templates/modules/filter/filterWrapperTpl"
], (SiteInfoTpl)->

    siteInfoModel = new Backbone.Model
        className: "textedTextInfo"
        tpl: SiteInfoTpl

    return declaration =
        componentModel: new Backbone.Model(
            rootClass: "textStats"
            itemClasses: ["textedText"]
        )
        componentItems: [
            { controlType: "filterPopupSimply", controlModel: siteInfoModel }
        ]
