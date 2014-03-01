define(["backbone", "marionette"], function(Backbone, Marionette) {
  var TableRowView;
  return TableRowView = Marionette.ItemView.extend({
    tagName: "tr",
    initialize: function() {
      this._columns = Marionette.getOption(this, "columns");
      this._itemHeight = Marionette.getOption(this, "itemHeight");
      return this.buildTemplate();
    },
    buildTemplate: function() {
      var column, _i, _len, _ref, _results;
      this.template = "";
      _ref = this._columns;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        column = _ref[_i];
        _results.push(this.template += "<td>{{" + column + "}}</td>");
      }
      return _results;
    },
    onRender: function() {
      if (this._itemHeight) {
        return this.setHeight(this._itemHeight);
      }
    },
    setHeight: function(h) {
      return this.$el.css("height", h);
    }
  });
});
