define(["marionette", "core/utils/collection/strategy/simpleComparison"], function(Marionette, simpleComparison) {
  var declaration, popupSettings;
  popupSettings = {
    className: 'bPopup'
  };
  return declaration = {
    componentModel: new Backbone.Model({
      rootClass: "filter",
      itemClasses: ["listButton", "sortedTable"]
    }),
    componentItems: [
      {
        controlType: "filterListButton",
        controlModel: new Backbone.Model({
          className: "filterListButton",
          items: new Backbone.Collection([
            {
              controlType: "filterButtonPopup",
              popup: popupSettings,
              filterField: 'data',
              filterFieldTitle: "Кастомное имя"
            }, {
              controlType: "filterButtonPopup",
              popup: popupSettings,
              filterField: 'nextfield',
              filterFieldTitle: "loc_ClientOrders"
            }, {
              controlType: "filterButtonPopup",
              popup: popupSettings,
              filterField: 'somefield',
              filterFieldTitle: "loc_PartnerOrders"
            }
          ])
        })
      }, {
        controlType: "tableControl",
        controlModel: new Backbone.Model({
          itemClassName: "tableItem",
          className: "tableControl",
          inject: ["typeOne", "typeTwo"],
          headers: ["loc_MyOrders", "loc_ClientOrders", "loc_PartnerOrders"],
          headerType: "controls/table/header/tableHeaderControl",
          bodyType: "controls/table/body/tableBodyControl",
          itemType: "controls/table/row/tableRowControl",
          collectionStrategy: simpleComparison,
          visibleModelFields: ["data", "nextfield", "somefield"],
          sortableFields: ["data", "nextfield", "somefield"]
        })
      }
    ]
  };
});
