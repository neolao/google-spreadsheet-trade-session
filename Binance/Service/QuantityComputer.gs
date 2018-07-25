var Binance_Service_QuantityComputer = function() {
  var applyFee = function(quantity, fee) {
    return quantity * (1 - fee);
  };
  var floorByPrecision = function(quantity, precision) {
    return Math.floor(quantity * Math.pow(10, precision)) / Math.pow(10, precision);
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
    var basePrecision = getBasePrecision(definition);
    
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
    baseQuantity = floorByPrecision(baseQuantity, basePrecision);
    return baseQuantity;
  };
  
  this.computeMaxBaseQuantity = function(definition, baseQuantity, price, fee) {
    var stepSize = getStepSize(definition);
    var basePrecision = getBasePrecision(definition);
    
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
    maxQuantity = floorByPrecision(maxQuantity, basePrecision);
    return maxQuantity;
  };
  
  this.decreaseBaseQuantityStep = function(definition, quantity, stepCount) {
    var stepSize = getStepSize(definition);
    var normalized = Number(quantity);
    for (var index = 0; index < stepCount; index++) {
      normalized = normalized - stepSize;
    }

    return normalized;
  };
}