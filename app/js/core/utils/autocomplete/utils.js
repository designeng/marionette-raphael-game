define([], function() {
  var charToUpper, getLocalRefName;
  charToUpper = function(str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  };
  getLocalRefName = function(locale) {
    return "name" + charToUpper(locale);
  };
  return getLocalRefName;
});
