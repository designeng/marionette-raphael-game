define([], function() {
  var routeMap;
  return routeMap = {
    "!/": {
      "header": ["header"],
      "content": ["flightSearchHistory"],
      "footer": ["footer"]
    },
    "!/footer": {
      "header": ["header"],
      "content": [],
      "footer": []
    },
    "!/header": {
      "header": ["header"],
      "content": [],
      "footer": []
    },
    "!/flight-stats": {
      "header": ["header"],
      "content": ["flightSearchHistory", "flightSearchHeader", "flightStats", "flightStatsResult"],
      "footer": ["footerInner"]
    },
    "!/flight-stats/result": {
      "header": ["header"],
      "content": ["flightStats", "flightStatsResult"],
      "footer": []
    },
    "!/sorted-table": {
      "header": [],
      "content": ["sortedTable"],
      "footer": []
    },
    "!/sorted-table/filters": {
      "header": ["header"],
      "content": ["sortedTableFilter"],
      "footer": ["footer"]
    },
    "!/popup-dev": {
      "header": [],
      "content": ["popupDev", "popupDevContent"],
      "footer": ["footer"]
    },
    "!/debug": {
      "header": [],
      "content": [],
      "footer": [],
      "debug": ["debug"]
    },
    "!/specReport": {
      "header": [],
      "content": [],
      "footer": [],
      "debug": ["specReport"]
    },
    "!/specReport/:line": {
      "header": [],
      "content": [],
      "footer": [],
      "debug": ["specReport"]
    }
  };
});
