(function() {
  define(function() {
    var componentItems;
    return componentItems = [
      {
        controlType: "linkControl",
        controlModel: new Backbone.Model({
          text: "test1",
          url: "url1"
        })
      }, {
        controlType: "linkControl",
        controlModel: new Backbone.Model({
          text: "test2",
          url: "url2"
        })
      }, {
        controlType: "navigationBarControl",
        controlModel: new Backbone.Model({
          links: new Backbone.Collection([
            {
              text: "Авиабилеты",
              url: "piano"
            }, {
              text: "Ж/д билеты",
              url: "lead guitar"
            }, {
              text: "Отели",
              url: "bass"
            }, {
              text: "Прокат авто",
              url: "sax"
            }, {
              text: "ещё...",
              url: "!/else",
              preventDefault: true,
              dropdown: new Backbone.Model({
                controlType: "hintControl",
                controlModel: new Backbone.Model({
                  items: new Backbone.Collection([
                    {
                      text: "Статус рейса",
                      route: "!/about"
                    }, {
                      text: "Расписание рейсов",
                      route: "!/about/location"
                    }, {
                      text: "Дополнительные услуги",
                      route: "!/debug"
                    }
                  ]),
                  className: "hintView",
                  width: 200
                })
              })
            }
          ]),
          className: "topLinks",
          display: "none"
        })
      }
    ];
  });

}).call(this);
