var Binance_Service_QuantityComputer = function() {
  var applyFee = function(quantity, fee) {
    return quantity * (1 - fee);
  };
  var floorByPrecision = function(quantity, precision) {
    return Math.floor(quantity * Math.pow(10, precision)) / Math.pow(10, precision);
  };
  var floorBySize = function(value, size) {
    var splittedValue = String(value).split(".");
    var currentPrecision = 8;
    if (splittedValue.length == 2) {
      currentPrecision = splittedValue[1].length;
    }
    var rounded = Math.round(value / size) * size;
    var precision = -Math.floor(Math.log(size)/Math.log(10));
    if (currentPrecision < precision) {
      precision = currentPrecision;
    }
    return Number(rounded).toFixed(precision);
  };
  var getStepSize = function(definition) {
    var stepSize = 0.001;
    if (Array.isArray(definition.filters)) {
      for (var index = 0; index < definition.filters.length; index++) {
        var filter = definition.filters[index];
        if (filter.filterType === "LOT_SIZE") {
          stepSize = Number(filter.stepSize);
        }
      }
    }
    return stepSize;
  };
  var getBasePrecision = function(definition) {
    return definition.baseAssetPrecision;
  };

  this.computeMaxBaseQuantityByQuoteQuantity = function(definition, quoteQuantity, price, fee) {
    var stepSize = getStepSize(definition);
    var basePrecision = getBasePrecision(definition) - 1;

    var baseQuantity = 0;
    var quoteSpent = 0;
    while (quoteSpent < quoteQuantity) {
        baseQuantity = baseQuantity + stepSize;
        quoteSpent = baseQuantity * price;
    }
    baseQuantity = baseQuantity - stepSize;

    if (fee) {
      baseQuantity = applyFee(baseQuantity, fee);
    }

    var extra = baseQuantity % stepSize;
    baseQuantity = baseQuantity - extra;
    baseQuantity = floorBySize(baseQuantity, stepSize);
    return baseQuantity;
  };

  this.computeMaxBaseQuantity = function(definition, baseQuantity, price, fee) {
    var stepSize = getStepSize(definition);
    var basePrecision = getBasePrecision(definition) - 1;

    var maxQuantity = 0;
    while (maxQuantity < baseQuantity) {
      maxQuantity = maxQuantity + stepSize;
    }
    maxQuantity = maxQuantity - stepSize;

    if (fee) {
      maxQuantity = applyFee(maxQuantity, fee);
    }

    var extra = maxQuantity % stepSize;
    maxQuantity = maxQuantity - extra;
    maxQuantity = floorBySize(maxQuantity, stepSize);
    return maxQuantity;
  };

  this.decreaseBaseQuantityStep = function(definition, quantity, stepCount) {
    var stepSize = getStepSize(definition);
    var basePrecision = getBasePrecision(definition) - 1;

    var normalized = Number(quantity);
    for (var index = 0; index < stepCount; index++) {
      normalized = normalized - stepSize;
    }

    var extra = normalized % stepSize;
    normalized = normalized - extra;
    normalized = floorBySize(normalized, stepSize);

    return normalized;
  };
}
