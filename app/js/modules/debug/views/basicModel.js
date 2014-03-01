(function() {
  define(["backbone"], function(Backbone) {
    var BasicModel;
    return BasicModel = Backbone.Model.extend({
      defaults: {
        firstName: "123",
        lastName: "test"
      },
      validation: {
        firstName: function(value, attr, computedState) {
          console.log("VALUE::::", value);
          if (value !== "test123") {
            return "Please provide your first name";
          }
        },
        lastName: {
          required: true,
          msg: "Please provide your last name"
        },
        email: [
          {
            required: true,
            msg: "Please provide your email"
          }, {
            pattern: "email",
            msg: "Email provided is not correct"
          }
        ]
      }
    });
  });

}).call(this);
