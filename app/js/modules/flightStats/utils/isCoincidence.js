define(function() {
  var isCoincidence;
  return isCoincidence = function(segment) {
    try {
      if (segment.startPoint.id && segment.startPoint.id === segment.endPoint.id && segment.startPoint.type === segment.endPoint.type) {
        return true;
      } else {
        return false;
      }
    } catch (_error) {
      return false;
    }
  };
});
