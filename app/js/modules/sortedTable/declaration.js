define(["marionette", "core/utils/collection/strategy/simpleComparison"], function(Marionette, simpleComparison) {
  var declaration;
  return declaration = {
    componentModel: new Backbone.Model({
      rootClass: "tableDevelop",
      itemClasses: ["sortedTable"]
    }),
    componentItems: [
      {
        controlType: "tableControl",
        controlModel: new Backbone.Model({
          className: "tableControl",
          width: 400,
          inject: ["typeOne", "typeTwo"],
          headers: ["loc_MyOrders", void 0, "loc_MyOrders", void 0, "loc_MyOrders"],
          headerHeight: 25,
          itemType: "controls/table/row/tableRowControl",
          headerType: "controls/table/header/tableHeaderControl",
          bodyType: "controls/table/body/tableBodyControl",
          visibleModelFields: ["data", void 0, "nextfield", void 0, "somefield"],
          sortableFields: ["data", "nextfield", "somefield"],
          collectionStrategy: simpleComparison,
          itemClassName: "tableItem",
          itemHeight: 25
        })
      }
    ]
  };
});
