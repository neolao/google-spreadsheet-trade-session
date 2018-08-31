/*
Fail to create sell order: Precision is over the maximum defined for this asset. (code -1111) {"symbol":"VETUSDT","side":"SELL","type":"LIMIT","timeInForce":"GTC","quantity":"24974.8","price":"0.0141799999999999999","newOrderRespType":"FULL","timestamp":1533671072294} Definition: {"symbol":"VETUSDT","status":"TRADING","baseAsset":"VET","baseAssetPrecision":8,"quoteAsset":"USDT","quotePrecision":8,"orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],"icebergAllowed":true,"filters":[{"filterType":"PRICE_FILTER","minPrice":"0.00140000","maxPrice":"0.14000000","tickSize":"0.00001000"},{"filterType":"LOT_SIZE","minQty":"0.10000000","maxQty":"90000000.00000000","stepSize":"0.10000000"},{"filterType":"MIN_NOTIONAL","minNotional":"10.00000000"},{"filterType":"ICEBERG_PARTS","limit":10},{"filterType":"MAX_NUM_ALGO_ORDERS","maxNumAlgoOrders":5}]}
*/

var Binance_Service_PriceNormalizer = function() {
  var floorByPrecision = function(price, precision) {
    return Math.floor(price * Math.pow(10, precision)) / Math.pow(10, precision);
  };
  var floorBySize = function(value, size) {
    var splittedValue = String(value).split(".");
    var currentPrecision = 8;
    if (splittedValue.length === 2) {
      currentPrecision = splittedValue[1].length;
    }
    var rounded = Math.round(value / size) * size;
    var precision = -Math.floor(Math.log(size)/Math.log(10));
    if (currentPrecision < precision) {
      precision = currentPrecision;
    }
    return Number(rounded).toFixed(precision);
  };

  this.normalize = function(definition, price) {
    var minPrice = 0;
    var maxPrice = null;
    var tickSize = 0.0001;

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

    if (!tickSize) {
      throw new Error("Undefined tickSize in definition: "+JSON.stringify(definition));
    }

    var normalized = Number(price);
    var extra = normalized % tickSize;
    normalized = normalized - extra;

    // Bug fix Javascript precision
    normalized = floorBySize(normalized, tickSize);

    return normalized;
  }
};
