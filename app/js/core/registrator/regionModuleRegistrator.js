(function() {
  define(function() {
    var RegionModuleRegistrator;
    return RegionModuleRegistrator = (function() {
      RegionModuleRegistrator.prototype.memoConfig = {};

      function RegionModuleRegistrator(ventObject) {
        this.ventObject = ventObject;
      }

      RegionModuleRegistrator.prototype.registerConfig = function(config) {
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
        var a, b, pageWorkFlow, part, region, zipped, _i, _len;
        pageWorkFlow = {};
        for (region in config) {
          if (!_memoConfig[region]) {
            a = [];
          } else {
            a = _memoConfig[region];
          }
          b = config[region];
          zipped = _.zip(a, b);
          if (!pageWorkFlow[region]) {
            pageWorkFlow[region] = {};
          }
          for (_i = 0, _len = zipped.length; _i < _len; _i++) {
            part = zipped[_i];
            if (part[1] !== part[0]) {
              if (!pageWorkFlow[region]["shut"]) {
                pageWorkFlow[region]["shut"] = [];
              }
              if (!pageWorkFlow[region]["open"]) {
                pageWorkFlow[region]["open"] = [];
              }
              pageWorkFlow[region]["shut"].push(part[0]);
              pageWorkFlow[region]["open"].push(part[1]);
            }
          }
        }
        return pageWorkFlow;
      };

      return RegionModuleRegistrator;

    })();
  });

}).call(this);
