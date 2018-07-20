var Binance_Service_PriceNormalizer = function() {
  var floorByPrecision = function(price, precision) {
    return Math.floor(price * Math.pow(10, precision)) / Math.pow(10, precision);
  };
  
  this.normalize = function(definition, price) {
    var minPrice = 0;
    var maxPrice = Infinity;
    var tickSize = 0.00000010;
    
    if (Array.isArray(definition.filters)) {
      for (var index = 0; index < definition.filters.length; index++) {
        var filter = definition.filters[index];
        if (filter.filterType === "PRICE_FILTER") {
          minPrice = Number(filter.minPrice);
          maxPrice = Number(filter.maxPrice);
          tickSize = Number(filter.tickSize);
        }
      }
    }

    var normalized = Number(price);
    var extra = normalized % tickSize;
    normalized = normalized - extra;

    normalized = floorByPrecision(normalized, definition.quotePrecision);
    return normalized;
  }
};