define(["Handlebars", "i18n!nls/general"], function(Handlebars, localized) {
  Handlebars.registerHelper("_decl", function(num, formsJSON) {
    var forms;
    formsJSON = Handlebars.helpers._(formsJSON);
    forms = JSON.parse(formsJSON);
    if (num % 10 === 1 && num % 100 !== 11) {
      return forms[0];
    } else if ((num % 10 >= 2) && (num % 10 <= 4) && (num % 100 < 10 || num % 100 >= 20)) {
      return forms[1];
    } else {
      return forms[2];
    }
  });
  Handlebars.registerHelper("_itemblank", function(text) {
    return "<li class='combobox__list__blankItem'>" + text + "</li>";
  });
  Handlebars.registerHelper("_", function(text) {
    var param, params, str;
    if (arguments.length > 2) {
      console.log("Handlebars.registerHelper ARGS > 2");
      str = arguments[0];
      params = _.toArray(arguments).slice(1, -1);
      param = void 0;
      while (str.indexOf("%s") !== -1) {
        param = (params.length === 1 ? params[0] : params.shift());
        str = str.replace(/%s/, param);
      }
      text = str;
    } else {
      text = localized[text];
    }
    return text;
  });
  Handlebars.registerHelper("if_eq", function(context, options) {
    if (context === options.hash.compare) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  Handlebars.registerHelper("equal", function(lvalue, rvalue, options) {
    if (arguments.length < 3) {
      throw new Error("Handlebars Helper equal needs 2 parameters");
    }
    if (lvalue !== rvalue) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });
  Handlebars.registerHelper("safeText", function(str) {
    if (str) {
      str = str.replace(/\s/g, '<span class="blank">_</span>');
      return new Handlebars.SafeString(str);
    }
  });
  return Handlebars.registerHelper("createControlDiv", function(index, classStr) {
    var str;
    str = "<div data-id='element__" + index + "' class='" + classStr + "'></div>";
    return new Handlebars.SafeString(str);
  });
});
