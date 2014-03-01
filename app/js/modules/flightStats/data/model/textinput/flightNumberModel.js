define(["backbone"], function(Backbone) {
  var FlightNumberModel;
  return FlightNumberModel = Backbone.Model.extend({
    validation: {
      id: {
        required: true,
        pattern: "flightNumber",
        msg: "some message flightNumber error"
      }
    }
  });
});
