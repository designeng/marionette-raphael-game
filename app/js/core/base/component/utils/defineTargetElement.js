define(function() {
  var defineTargetElement;
  return defineTargetElement = function(collectionView, index) {
    var findSelector, targetElement;
    findSelector = "[data-id='" + this.cid + "__" + index + "']";
    if (this._rootClass) {
      findSelector = "[data-id='element__" + index + "']";
    }
    targetElement = collectionView.$el.find(findSelector);
    if (!targetElement.length) {
      if (!this._rootClass) {
        throw new Error("HTML element with data-id='" + this.cid + "__" + index + "' is not found! Check your template");
      } else {
        throw new Error("HTML element with data-id='element__" + index + "' is not found! Your declaration componentModel.itemClasses may has not correspondence with componentItems");
      }
    }
    return targetElement;
  };
});
