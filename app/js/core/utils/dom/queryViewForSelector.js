define(function() {
  var queryViewForSelector;
  return queryViewForSelector = function(view, selector) {
    var $elements;
    $elements = view.$(selector);
    if (view.$el.is(selector)) {
      $elements = $elements.add(view.$el);
    }
    return $elements;
  };
});
