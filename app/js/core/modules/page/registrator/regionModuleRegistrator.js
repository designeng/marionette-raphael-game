define(function() {
  var RegionModuleRegistrator;
  return RegionModuleRegistrator = (function() {
    function RegionModuleRegistrator() {}

    RegionModuleRegistrator.prototype.memoConfig = {};

    RegionModuleRegistrator.prototype.registerPageConfig = function(config) {
      var region, _memoConfig;
      if (_.isEmpty(this.memoConfig)) {
        for (region in config) {
          this.memoConfigPopulate(region, config[region]);
        }
        _memoConfig = {};
      } else {
        _memoConfig = this.memoConfig;
        this.memoConfig = config;
      }
      return this.processRegionConfiguration(config, _memoConfig);
    };

    RegionModuleRegistrator.prototype.memoConfigPopulate = function(region, modules) {
      return this.memoConfig[region] = modules;
    };

    RegionModuleRegistrator.prototype.processRegionConfiguration = function(config, _memoConfig) {
      var a, b, pageStructure, part, region, zipped, _i, _len;
      pageStructure = {};
      for (region in config) {
        if (!_memoConfig[region]) {
          a = [];
        } else {
          a = _memoConfig[region];
        }
        b = config[region];
        zipped = _.zip(a, b);
        if (!pageStructure[region]) {
          pageStructure[region] = {};
        }
        for (_i = 0, _len = zipped.length; _i < _len; _i++) {
          part = zipped[_i];
          if (part[1] !== part[0]) {
            if (!pageStructure[region]["shut"]) {
              pageStructure[region]["shut"] = [];
            }
            if (!pageStructure[region]["open"]) {
              pageStructure[region]["open"] = [];
            }
            pageStructure[region]["shut"].push(part[0]);
            pageStructure[region]["open"].push(part[1]);
          }
        }
      }
      return pageStructure;
    };

    return RegionModuleRegistrator;

  })();
});
