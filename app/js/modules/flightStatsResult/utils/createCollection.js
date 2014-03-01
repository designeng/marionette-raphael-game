define(["backbone", "moment", "getLocale", "i18n!nls/general", "core/utils/locale/prepareLocalized"], function(Backbone, moment, getLocale, localized, prepareLocalized) {
  var actualStatus, createCollection, findModelById, getAirportName, getCode, getLocStatus, getMarketingCompanyLogo, getMarketingCompanyName, getStatus, getVehicleName, localName, proxyLocationObject;
  proxyLocationObject = {
    localized: localized
  };
  actualStatus = ["SCHEDULED", "ACTIVE", "LANDED", "DIVERTED", "CANCELLED", "UNKNOWN"];
  findModelById = function(id) {
    var model;
    model = this.where({
      id: id
    })[0];
    return model;
  };
  localName = function(name) {
    return "name" + getLocale({
      uppercase: true
    });
  };
  getCode = function(dict, id) {
    var code, model;
    model = findModelById.call(dict, id);
    if (!(code = model.get("codeIata"))) {
      code = model.get("codeSirena");
    }
    return code;
  };
  getMarketingCompanyLogo = function(dict, id) {
    var model;
    model = findModelById.call(dict, id);
    if (model.get("hasLogo")) {
      return model.get("logo");
    } else {
      return false;
    }
  };
  getMarketingCompanyName = function(dict, id) {
    var model;
    model = findModelById.call(dict, id);
    return model.get(localName());
  };
  getAirportName = function(dict, id) {
    var model;
    model = findModelById.call(dict, id);
    return model.get(localName());
  };
  getVehicleName = function(dict, id) {
    var model;
    model = findModelById.call(dict, id);
    return model.get(localName());
  };
  getLocStatus = function(dict, id) {
    var model, status;
    model = findModelById.call(dict, id);
    status = prepareLocalized.call(proxyLocationObject, "loc_" + model.get("name"), "string");
    return status;
  };
  getStatus = function(dict, id) {
    return String((findModelById.call(dict, id)).get("name")).toLowerCase();
  };
  return createCollection = function(dictionaries) {
    var airTripsProvider, collection, item, model, provider, _i, _len;
    airTripsProvider = this.data.flightStates[0].airTrips;
    collection = new Backbone.Collection();
    for (_i = 0, _len = airTripsProvider.length; _i < _len; _i++) {
      item = airTripsProvider[_i];
      provider = item.segments[0].legs;
      model = new Backbone.Model();
      model.set("code", getCode(dictionaries[provider.marketingCompany.type], provider.marketingCompany.id));
      model.set("mergedFlightsCode", getCode(dictionaries[provider.marketingCompany.type], provider.marketingCompany.id));
      model.set("marketingCompanyLogo", getMarketingCompanyLogo(dictionaries[provider.marketingCompany.type], provider.marketingCompany.id));
      model.set("marketingCompanyName", getMarketingCompanyName(dictionaries[provider.marketingCompany.type], provider.marketingCompany.id));
      model.set("flightNumber", provider.flightNumber);
      model.set("mergedFlightsFlightNumber", item.flightNumber);
      model.set("airportDepartureName", getAirportName(dictionaries[provider.origin.type], provider.origin.id));
      model.set("airportArrivalName", getAirportName(dictionaries[provider.destination.type], provider.destination.id));
      model.set("plannedVehicleName", getVehicleName(dictionaries[provider.plannedVehicle.type], provider.plannedVehicle.id));
      model.set("actualVehicleName", getVehicleName(dictionaries[provider.actualVehicle.type], provider.actualVehicle.id));
      model.set("locStatus", getLocStatus(dictionaries[provider.flightState.type], provider.flightState.id));
      model.set("status", getStatus(dictionaries[provider.flightState.type], provider.flightState.id));
      model.set("originTerminal", provider.originTerminal);
      model.set("originGate", provider.originGate);
      model.set("destinationTerminal", provider.destinationTerminal);
      model.set("destinationGate", provider.destinationGate);
      model.set("actualArrivalDate", provider.actualArrivalDate);
      model.set("actualArrivalTime", provider.actualArrivalTime);
      model.set("actualArrivalUnix", moment(provider.actualArrivalDate + " " + provider.actualArrivalTime).valueOf());
      model.set("actualDepartureDate", provider.actualDepartureDate);
      model.set("actualDepartureTime", provider.actualDepartureTime);
      model.set("actualDepartureUnix", moment(provider.actualDepartureDate + " " + provider.actualDepartureTime).valueOf());
      model.set("plannedArrivalDate", provider.plannedArrivalDate);
      model.set("plannedArrivalTime", provider.plannedArrivalTime);
      model.set("plannedArrivalUnix", moment(provider.plannedArrivalDate + " " + provider.plannedArrivalTime).valueOf());
      model.set("plannedDepartureDate", provider.plannedDepartureDate);
      model.set("plannedDepartureTime", provider.plannedDepartureTime);
      model.set("plannedDepartureUnix", moment(provider.plannedDepartureDate + " " + provider.plannedDepartureTime).valueOf());
      model.set("mergedFlightsInfo", provider.mergedFlights);
      collection.add(model);
    }
    return collection;
  };
});
