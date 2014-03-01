define(["marionette"], function(Marionette) {
  Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
    var template;
    template = templateId;
    if (!template || template.length === 0) {
      template = " ";
    }
    return template;
  };
  return Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
    if (!_.isFunction(rawTemplate)) {
      return Handlebars.compile(rawTemplate);
    } else {
      return rawTemplate;
    }
  };
});
