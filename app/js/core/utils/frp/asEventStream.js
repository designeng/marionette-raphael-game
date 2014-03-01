define(["bacon"], function(Bacon) {
  var asEventStream, next;
  next = function(value) {
    return new Bacon.Next(Bacon._.always(value));
  };
  return asEventStream = function(eventName, eventTransformer) {
    var target;
    if (!eventTransformer) {
      eventTransformer = Bacon._.id;
    }
    target = this;
    return new Bacon.EventStream(function(sink) {
      var handler, unbind;
      handler = function() {
        var args, reply;
        args = (1 <= arguments.length ? [].slice.call(arguments, 0) : []);
        reply = sink(next(eventTransformer.apply(null, args)));
        if (reply === Bacon.noMore) {
          return unbind();
        }
      };
      unbind = function() {
        return target.off(eventName, handler);
      };
      target.on(eventName, handler);
      return unbind;
    });
  };
});
