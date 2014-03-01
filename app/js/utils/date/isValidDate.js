define(function() {
  var isValidDate;
  return isValidDate = function(txtDate) {
    var currVal, dtArray, dtDay, dtMonth, dtYear, isleap, rxDatePattern;
    currVal = txtDate;
    if (currVal === "") {
      return false;
    }
    rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
    dtArray = currVal.match(rxDatePattern);
    if (dtArray == null) {
      return false;
    }
    dtMonth = dtArray[3];
    dtDay = dtArray[5];
    dtYear = dtArray[1];
    if (dtMonth < 1 || dtMonth > 12) {
      return false;
    } else if (dtDay < 1 || dtDay > 31) {
      return false;
    } else if ((dtMonth === 4 || dtMonth === 6 || dtMonth === 9 || dtMonth === 11) && dtDay === 31) {
      return false;
    } else if (dtMonth === 2) {
      isleap = dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0);
      if (dtDay > 29 || (dtDay === 29 && !isleap)) {
        return false;
      }
    }
    return true;
  };
});
