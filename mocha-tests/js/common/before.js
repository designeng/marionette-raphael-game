define(["marionette", "Handlebars", "appbootstrap", "moduleHash", "handlebarsHelpers", "extended"], function(Marionette, Handlebars, App, moduleHash) {
  var appStarted, startBaseApplication;
  appStarted = false;
  startBaseApplication = function() {
    var routeMap;
    console.log("startBaseApplication");
    routeMap = {
      "!/": {
        "header": [],
        "content": [],
        "footer": []
      },
      "!/header": {
        "header": ["header"],
        "content": [],
        "footer": []
      },
      "!/sorted-table": {
        "header": [],
        "content": ["sortedTable"],
        "footer": []
      },
      "!/footer": {
        "header": [],
        "content": [],
        "footer": ["footer"]
      }
    };
    App.start({
      routeMap: routeMap
    });
    window.moduleHash = moduleHash;
    window.location.href = "/mocha-tests/test2.html#!/header";
    appStarted = true;
    return true;
  };
  return before(function() {
    if (!appStarted) {
      return startBaseApplication();
    }
  });
});
