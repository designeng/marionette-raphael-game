define [
    "marionette"
    "core/utils/collection/strategy/simpleComparison"
], (Marionette, simpleComparison) ->

    # настройки отображения попапа
    popupSettings = 
        className       : 'bPopup'

    declaration = {
        componentModel: new Backbone.Model
            rootClass   : "filter"
            itemClasses : ["listButton", "sortedTable"]

        componentItems: [
            # filter pupup buttons
            { controlType: "filterListButton", controlModel: new Backbone.Model
                className: "filterListButton"
                items: new Backbone.Collection [ 
                    { controlType: "filterButtonPopup", popup: popupSettings, filterField: 'data',      filterFieldTitle: "Кастомное имя" }
                    { controlType: "filterButtonPopup", popup: popupSettings, filterField: 'nextfield', filterFieldTitle: "loc_ClientOrders" }
                    { controlType: "filterButtonPopup", popup: popupSettings, filterField: 'somefield', filterFieldTitle: "loc_PartnerOrders" }
                ]
            },

            # table
            { controlType: "tableControl", controlModel: new Backbone.Model
                itemClassName   : "tableItem"
                className       : "tableControl"
                inject          : ["typeOne", "typeTwo"]                                # test detect injection
                headers         : ["loc_MyOrders", "loc_ClientOrders", "loc_PartnerOrders"]

                headerType  : "controls/table/header/tableHeaderControl"                # use it as defaut
                bodyType    : "controls/table/body/tableBodyControl"
                itemType    : "controls/table/row/tableRowControl"

                collectionStrategy  : simpleComparison
                visibleModelFields  : ["data", "nextfield", "somefield"]
                sortableFields      : ["data", "nextfield", "somefield"]
            }
        ]
    }
