define [
    "hbs!templates/modules/footer/siteInfoTpl"
], (SiteInfoTpl)->
    # popupDevelopment__popup__popupControl
    popupModel = new Backbone.Model
        rootClass: "popupDevelopment"
        itemClasses: ["popup"]
        componentType: "popup"   # inside/outside

    popupControllModelOutside = new Backbone.Model
        className: "popupControl"
        width: 600
        height: 400
        centeringWidthPosition: true
        centeringHeightPosition: true
        borderColor: "black"
        content: "popupDevContent"
        closeButton: true
        mask: true

    declaration =
        componentModel: popupModel
        componentItems:[
            { controlType: "popupControl", controlModel: popupControllModelOutside }
        ]


