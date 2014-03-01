define(["marionette", "boxModel", "core/utils/collection/strategy/simpleComparison", "hbs!templates/modules/flightStatsResult/fromToTitle"], function(Marionette, BoxModel, simpleComparison, FromToTitleTpl) {
  var declaration, filterConfigAirport, filterConfigCompany, infoStateModel, popupSettings;
  popupSettings = {
    className: 'bPopup'
  };
  filterConfigCompany = {
    type: 'filterPopupSimplyContent',
    param: {
      filterTitle: "loc_Aircompany",
      filterField: 'marketingCompanyName'
    }
  };
  filterConfigAirport = {
    type: 'filterPopupListContent',
    param: {
      filterTitle: "loc_Airports",
      filterItems: [
        {
          title: "loc_DepartureAirport",
          field: 'airportDepartureName'
        }, {
          title: "loc_ArrivalAirport",
          field: 'airportArrivalName'
        }
      ],
      filterField: 'marketingCompanyName'
    }
  };
  infoStateModel = new Backbone.Model({
    cases: [
      {
        pleaseWaitWhileSearching: "loc_PleaseWaitWhileSearching"
      }, {
        flightPointNotFound: "loc_FlightPointNotFound"
      }, {
        flightsNotFoundGotoSchedule: "loc_FlightsNotFoundGotoSchedule"
      }
    ]
  });
  return declaration = {
    componentModel: new Backbone.Model({
      rootClass: "flightStatsResult",
      itemClasses: ["listButton", "fromToTitle", "flightTable", "infoState", "serverError"],
      inputErrorHandlerCid: "flightStatsResultErrorHandler"
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
              filterConfig: filterConfigCompany
            }, {
              controlType: "filterButtonPopup",
              popup: popupSettings,
              filterConfig: filterConfigAirport
            }
          ])
        })
      }, {
        controlType: "simpleTplControl",
        controlModel: new Backbone.Model({
          tpl: FromToTitleTpl,
          tplModel: new Backbone.Model({
            fromField: "loc_FlightPointNotFound",
            toField: "loc_PleaseWaitWhileSearching"
          }),
          bindings: {
            fromField: '[name=fromField]',
            toField: '[name=toField]'
          }
        })
      }, {
        controlType: "tableControl",
        controlModel: new Backbone.Model({
          className: "tableControl",
          width: 400,
          headers: [void 0, "loc_Departure", "loc_Arrival", "loc_Flight", "loc_Status"],
          headerHeight: 25,
          headerType: "controls/table/header/tableHeaderControl",
          bodyType: "controls/table/body/tableBodyControl",
          itemType: "controls/table/row/flightStatesResult/flightStatesResultTableRow",
          visibleModelFields: ["plannedDepartureUnix", "plannedArrivalUnix"],
          sortableFields: ["plannedDepartureUnix", "plannedArrivalUnix"],
          collectionStrategy: simpleComparison,
          itemClassName: "tableItem",
          itemHeight: 25
        })
      }, {
        controlType: "infoControl",
        controlModel: infoStateModel
      }, {
        controlType: "inputError",
        controlModel: new BoxModel({
          text: "inputError Error here",
          width: 150,
          height: 80
        })
      }
    ]
  };
});
