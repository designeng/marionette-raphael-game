define(["backbone", "marionette", "moment", "hbs!templates/modules/flightStatsResult/flightStatsResultTableRowTpl"], function(Backbone, Marionette, moment, flightStatsResultTableRowTpl) {
  var FlightStatesResultTableRowView;
  return FlightStatesResultTableRowView = Marionette.ItemView.extend({
    template: flightStatsResultTableRowTpl,
    tagName: "tr",
    initialize: function() {
      this.applyOptions(["columns", "itemHeight"]);
      this.model.set("formatDate", this.getFormatDate());
      return console.log("mergedFlightsInfo", this.model.get("mergedFlightsInfo"));
    },
    getFormatDate: function() {
      var actualArrivalTime, actualDepartureTime, currentTime, oFormatDate, plannedArrivalTime, plannedDepartureTime;
      currentTime = moment().format('YYYY-MM-DD HH:mm');
      plannedDepartureTime = this.model.get("plannedDepartureDate") + " " + this.model.get("plannedDepartureTime");
      actualDepartureTime = this.model.get("actualDepartureDate") + " " + this.model.get("actualDepartureTime");
      plannedArrivalTime = this.model.get("plannedArrivalDate") + " " + this.model.get("plannedArrivalTime");
      actualArrivalTime = this.model.get("actualArrivalDate") + " " + this.model.get("actualArrivalTime");
      return oFormatDate = {
        planDepTime: moment(plannedDepartureTime).format('h:mm'),
        actDepTime: moment(actualDepartureTime).format('h:mm'),
        planActDepSameTime: moment(plannedDepartureTime).isSame(actualDepartureTime),
        planArrTime: moment(plannedArrivalTime).format('h:mm'),
        actArrTime: moment(actualArrivalTime).format('h:mm'),
        planActArrSameTime: moment(plannedArrivalTime).isSame(actualArrivalTime),
        dayAfterArrDate: moment(this.model.get("plannedArrivalDate")).isAfter(this.model.get("plannedDepartureDate"))
      };
    },
    isBefore: function(a, b) {
      return moment(a).format("X") < moment(b).format("X");
    },
    isAfter: function(a, b) {
      return moment(a).format("X") > moment(b).format("X");
    },
    onRender: function() {
      if (this.itemHeight) {
        return this.setHeight(this.itemHeight);
      }
    },
    setHeight: function(h) {
      return this.$el.css("height", h);
    }
  });
});
