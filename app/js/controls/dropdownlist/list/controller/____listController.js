(function() {
  define(["marionette"], function(Marionette) {
    var ListController;
    ListController = Marionette.Controller.extend({
      _topIndex: 0,
      initialize: function(options) {
        this._currentItemIndex = 0;
        this.$el = options.$el;
        this.itemOverClass = options.itemOverClass;
        this.itemHeight = options.itemHeight;
        this.listHeight = options.listHeight;
        return _.bindAll(this, "pointTo");
      },
      onRender: function() {
        this._currentTopEl = this.$el.find("li:first");
        return this._topIndex = 0;
      },
      onShow: function() {
        this.extractAllItems();
        console.log(this._items[this._currentItemIndex], this._currentItemIndex);
        return this._currentEl = this._items[this._currentItemIndex];
      },
      onClose: function() {
        return this._items = [];
      },
      extractAllItems: function() {
        return this._items = this.$el.find("li");
      },
      setFirstActive: function() {
        return this.$el.find("li:first").addClass(this.itemOverClass);
      },
      onItemOver: function(index) {
        if (index === this._currentItemIndex) {

        } else {
          return this.highlight(index);
        }
      },
      calculateTopElementIndex: function(dir) {
        switch (dir) {
          case "down":
            return this._topIndex += 1;
          case "up":
            return this._topIndex -= 1;
          case "page_down":
            return this._topIndex = ((this._items.length - 1) - this._topIndex < 10 ? this._items.length - 1 : this._topIndex + 10);
          case "page_up":
            return this._topIndex = (this._topIndex < 10 ? 0 : this._topIndex - 10);
        }
      },
      pointTo: function(action) {
        var top;
        console.log(action);
        console.log("@_currentEl", this._currentEl);
        top = $(this._currentEl).position().top;
        switch (action) {
          case "up":
            console.log("UP");
            if (this._currentItemIndex === 0) {
              break;
            }
            this._currentItemIndex = this._currentItemIndex - 1;
            this._currentEl = this._items[this._currentItemIndex];
            if (this._currentEl) {
              if (top <= 0) {
                this.calculateTopElementIndex(action);
                this._currentTopEl = this._items[this._topIndex];
                return this.scrollToElement(this._currentTopEl);
              }
            } else {
              return console.log("NO current el");
            }
            break;
          case "down":
            console.log("DOWN");
            if (this._currentItemIndex === this._items.length - 1) {
              break;
            }
            this._currentItemIndex += 1;
            this._currentEl = this._items[this._currentItemIndex];
            if (this._currentEl) {
              if (top + this.itemHeight > this.listHeight) {
                this.calculateTopElementIndex(action);
                this._currentTopEl = this._items[this._topIndex];
                return this.scrollToElement(this._currentTopEl);
              }
            } else {
              return console.log("NO current el");
            }
            break;
          case "page_up":
            this.calculateTopElementIndex(action);
            this._currentTopEl = this._items[this._topIndex];
            return this.scrollToElement(this._currentTopEl);
          case "page_down":
            this.calculateTopElementIndex(action);
            this._currentTopEl = this._items[this._topIndex];
            return this.scrollToElement(this._currentTopEl);
          case "home":
            this._currentItemIndex = 0;
            this._currentEl = this._items[this._currentItemIndex];
            return this.pointTo(this._currentEl);
          case "end":
            this._currentItemIndex = this._items.length - 1;
            this._currentEl = this._items[this._currentItemIndex];
            this.pointTo(this._currentEl);
            return this.highlight(this._currentItemIndex);
        }
      },
      scrollToElement: function(el) {
        return $(el).ScrollTo({
          duration: 100,
          callback: function() {
            return console.log("scrolled");
          }
        });
      },
      clearHighlighting: function() {
        var i, _results;
        i = 0;
        _results = [];
        while (i < this._items.length - 1) {
          $(this._items[i]).removeClass(this.itemOverClass);
          _results.push(i++);
        }
        return _results;
      },
      highlight: function(index) {
        this.clearHighlighting();
        this._currentItemIndex = index;
        this._currentEl = this._items[index];
        return $(this._currentEl).addClass(this.itemOverClass);
      }
    });
    return ListController;
  });

}).call(this);
