define(["backbone"], function(Backbone) {
  var FlightModel;
  return FlightModel = Backbone.Model.extend({
    validation: {
      id: {
        required: true,
        pattern: /^\d+$/,
        msg: "some message id error"
      },
      type: {
        required: true,
        pattern: /^(CITY|AIRPORT)$/,
        msg: "some message type error"
      }
    }
  });
});
