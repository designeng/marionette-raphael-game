define(function() {
  var simpleComparison;
  return simpleComparison = {
    sortDirection: -1,
    sortByAttr: function(attr, sortDirection) {
      this.sortAttribute = attr;
      this.sortDirection = sortDirection;
      return this.sort();
    },
    comparator: function(a, b) {
      a = a.get(this.sortAttribute);
      b = b.get(this.sortAttribute);
      if (a === b) {
        return 0;
      }
      if (this.sortDirection === 1) {
        if (a > b) {
          return 1;
        } else {
          return -1;
        }
      } else {
        if (a < b) {
          return 1;
        } else {
          return -1;
        }
      }
    }
  };
});
