define(function() {
  var filterData;
  return filterData = function(model) {
    var inputName, point, res;
    if (inputName = model.get("inputName")) {
      if (inputName === "flightFrom" || inputName === "flightTo") {
        point = {
          id: parseInt(model.get("id")),
          type: model.get("type")
        };
      }
      switch (inputName) {
        case "flightFrom":
          res = {
            startPoint: point
          };
          break;
        case "flightTo":
          res = {
            endPoint: point
          };
          break;
        case "flightNumber":
          res = {
            flightNumber: model.get("data")
          };
      }
      return res;
    }
  };
});
