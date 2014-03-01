var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["backbone", "marionette"], function(Backbone, Marionette) {
  var TableHeaderView;
  return TableHeaderView = Marionette.Layout.extend({
    template: "<tr>{{#each headers}}                    {{#if this}}                        <th class='{{../../headerClassPrefix}}{{@index}}'>{{this}}</th>                                        {{else}}                        <th class='blank'></th>                                   {{/if}}                    {{/each}}                    </tr>",
    tagName: "thead",
    _upSortingClass: "upSorting",
    _downSortingClass: "downSorting",
    initialize: function() {
      this.applyOptions(["eventBus", "columns", "headerHeight", "headerClassPrefix", "sortableFields", "headers", "tableController"]);
      if (!this.model) {
        this.model = new Backbone.Model;
      }
      this.model.set("headerClassPrefix", this.headerClassPrefix);
      this.model.set("headers", this.translateHeaders(this.headers));
      _.bindAll(this, "onHeaderClick");
      return this.on("header:click", this.onHeaderClick);
    },
    translateHeaders: function(loc_headers) {
      return this.prepareLocalized(loc_headers, "array");
    },
    setHeaderHandlers: function() {
      var actualSorted, i, val, _i, _len, _ref, _ref1, _results;
      actualSorted = _.intersection(this.columns, this.sortableFields);
      _ref = this.columns;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        val = _ref[i];
        if (_ref1 = this.getColumnHeader(i), __indexOf.call(actualSorted, _ref1) >= 0) {
          this.setHandler(i);
          _results.push(this.tableController.defineSortDirection(i, true));
        } else {
          _results.push(this.tableController.defineSortDirection(i, false));
        }
      }
      return _results;
    },
    setHandler: function(i) {
      var _this = this;
      return this.$el.find("th." + this.headerClassPrefix + i).click(function(e) {
        return _this.trigger("header:click", i, $(e.target));
      });
    },
    getColumnHeader: function(i) {
      return this.columns[i];
    },
    onHeaderClick: function(i, $targetEl) {
      this.tableController.sort(this.columns[i], i);
      return this.changeSortingClass($targetEl, i, this.tableController.getDirection(i));
    },
    changeSortingClass: function($el, i, dir) {
      $el.removeClass(this._upSortingClass).removeClass(this._downSortingClass);
      if (dir > 0) {
        return $el.addClass(this._upSortingClass);
      } else if (dir < 0) {
        return $el.addClass(this._downSortingClass);
      }
    },
    onRender: function() {
      this.setHeaderHandlers();
      return this.setHeight(this.headerHeight);
    },
    setHeight: function(h) {
      return this.$el.find("tr").css("height", h);
    }
  });
});
