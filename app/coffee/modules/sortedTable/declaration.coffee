define [
    "marionette"
    "core/utils/collection/strategy/simpleComparison"
], (Marionette, simpleComparison) ->

    declaration =
        componentModel: new Backbone.Model(
                rootClass: "tableDevelop"
                itemClasses: ["sortedTable"]
            )
        componentItems: [
                        {controlType: "tableControl", controlModel: new Backbone.Model(
                                className: "tableControl"
                                width: 400

                                # test detect injection
                                inject: ["typeOne", "typeTwo"]

                                headers: ["loc_MyOrders", undefined, "loc_MyOrders",  undefined,  "loc_MyOrders"]
                                headerHeight: 25

                                # use it as defaut
                                itemType: "controls/table/row/tableRowControl"
                                headerType: "controls/table/header/tableHeaderControl"
                                bodyType: "controls/table/body/tableBodyControl"

                                visibleModelFields: ["data", undefined, "nextfield", undefined, "somefield"]

                                sortableFields: ["data", "nextfield", "somefield"]

                                collectionStrategy: simpleComparison

                                itemClassName: "tableItem"
                                itemHeight: 25
                            )}
                    ]        
