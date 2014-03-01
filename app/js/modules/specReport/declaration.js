var dataArr, lineToScroll, mediator, param, path, requirejsConfig;

mediator = require("mediator");

param = mediator.getCurrentParam()[0];

dataArr = param.split(":");

path = dataArr[0].split("\\").join("/");

lineToScroll = dataArr[1];

requirejsConfig = requirejs.s.contexts._.config;

path = path.replace(requirejsConfig["baseUrl"], "");

define(["marionette", "buttonModel", "inputTextModel", "boxModel", "dropDownListModel", "text!" + path], function(Marionette, ButtonModel, InputTextModel, BoxModel, DropDownListModel, jsText) {
  var declaration, lines, linesList;
  lines = jsText.split("\n");
  linesList = _.map(lines, function(line) {
    var lineModel;
    return lineModel = new Backbone.Model({
      text: line
    });
  });
  declaration = {
    componentItems: [
      {
        controlType: "dropDownListControl",
        controlModel: new DropDownListModel({
          className: "dropDownList",
          width: document.body.offsetWidth,
          height: document.body.offsetHeight,
          listHeight: document.body.offsetHeight,
          display: true,
          collection: new Backbone.Collection(linesList),
          stayOpen: true,
          itemType: "textControl",
          itemClassName: "specResultItem",
          itemHeight: 25,
          itemOverClass: "specResultItem--over",
          firstVisible: lineToScroll,
          errorItemClass: "specResultItem--error"
        })
      }
    ]
  };
  return declaration;
});
