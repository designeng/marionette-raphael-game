define(["jquery"], function($) {
  var findCenter;
  return findCenter = function(elem) {
    var document, offset;
    offset = void 0;
    document = $(elem.ownerDocument);
    elem = $(elem);
    offset = elem.offset();
    return {
      x: offset.left + elem.outerWidth() / 2 - document.scrollLeft(),
      y: offset.top + elem.outerHeight() / 2 - document.scrollTop()
    };
  };
});
