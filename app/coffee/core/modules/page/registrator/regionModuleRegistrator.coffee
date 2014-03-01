define ->

    class RegionModuleRegistrator
        
        memoConfig: {}

        registerPageConfig: (config) ->
            if _.isEmpty @memoConfig
                for region of config
                    @memoConfigPopulate region, config[region]
                _memoConfig = {}
            else 
                _memoConfig = @memoConfig
                @memoConfig = config
            @processRegionConfiguration config, _memoConfig
        
        memoConfigPopulate: (region, modules) ->
            @memoConfig[region] = modules

        processRegionConfiguration: (config, _memoConfig) ->
            pageStructure = {}
            for region of config
                if !_memoConfig[region]
                    a = []
                else
                    a = _memoConfig[region]
                b = config[region]

                zipped = _.zip(a, b)

                if !pageStructure[region]
                    pageStructure[region] = {}

                for part in zipped
                    if part[1] != part[0]                        
                        if !pageStructure[region]["shut"]
                            pageStructure[region]["shut"] = []
                        if !pageStructure[region]["open"]
                            pageStructure[region]["open"] = []
                        pageStructure[region]["shut"].push part[0]
                        pageStructure[region]["open"].push part[1]

            return pageStructure



