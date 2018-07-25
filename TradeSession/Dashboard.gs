var TradeSession_Dashboard = function(sheet, config) {
  var self = this;
  var denormalizePercent = function(normalizedValue) {
    if (normalizedValue == "None") {
      return null;
    }
    return normalizedValue;
  };
  
  this.getQuoteQuantity = function() {
    return sheet.getRange(config.quoteQuantityCell).getValues()[0][0];
  };
  
  this.setStartDate = function(date) {
    sheet.getRange(config.startDateCell).setValues([[date]]);
  };
  
  this.setEndDate = function(date) {
    sheet.getRange(config.endDateCell).setValues([[date]]);
  };
  
  this.getBuyPrice = function(price) {
    return sheet.getRange(config.buyPriceCell).getValues()[0][0];
  };
  
  this.setBuyPrice = function(price) {
    sheet.getRange(config.buyPriceCell).setValues([[price]]);
  };
  
  this.getCurrentPrice = function() {
    sheet.getRange(config.currentPriceCell).getValues()[0][0];
  };
  
  this.getHighestPrice = function() {
    sheet.getRange(config.highestPriceCell).getValues()[0][0];
  };
  
  this.setHighestPrice = function(price) {
    sheet.getRange(config.highestPriceCell).setValues([[price]]);
  };
  
  this.getStopLossPercent = function() {
    return denormalizePercent(sheet.getRange(config.stopLossPercentCell).getValues()[0][0]);
  };
  this.getStopLossOrderId = function() {
    sheet.getRange(config.stopLossOrderIdCell).getValues()[0][0];
  };
  this.setStopLossOrderId = function(orderId) {
    sheet.getRange(config.stopLossOrderIdCell).setValues([[orderId]]);
  };
  
  this.getTakeProfitPercent1 = function() {
    return denormalizePercent(sheet.getRange(config.takeProfitPercent1Cell).getValues()[0][0]);
  };
  this.getTakeProfitOrderId1 = function() {
    sheet.getRange(config.takeProfitOrderId1Cell).getValues()[0][0];
  };
  this.setTakeProfitOrderId1 = function(orderId) {
    sheet.getRange(config.takeProfitOrderId1Cell).setValues([[orderId]]);
  };
  
  this.getTakeProfitPercent2 = function() {
    return denormalizePercent(sheet.getRange(config.takeProfitPercent2Cell).getValues()[0][0]);
  };
  this.getTakeProfitOrderId2 = function() {
    sheet.getRange(config.takeProfitOrderId2Cell).getValues()[0][0];
  };
  this.setTakeProfitOrderId2 = function(orderId) {
    sheet.getRange(config.takeProfitOrderId2Cell).setValues([[orderId]]);
  };
  
  this.getTakeProfitPercent3 = function() {
    return denormalizePercent(sheet.getRange(config.takeProfitPercent3Cell).getValues()[0][0]);
  };
  this.getTakeProfitOrderId3 = function() {
    sheet.getRange(config.takeProfitOrderId3Cell).getValues()[0][0];
  };
  this.setTakeProfitOrderId3 = function(orderId) {
    sheet.getRange(config.takeProfitOrderId3Cell).setValues([[orderId]]);
  };
  
  this.getTrailingStopTrigger = function() {
    return denormalizePercent(sheet.getRange(config.trailingStopTriggerCell).getValues()[0][0]);
  };
  this.getTrailingStopThreshold = function() {
    return denormalizePercent(sheet.getRange(config.trailingStopThresholdCell).getValues()[0][0]);
  };
  this.getTrailingStopOrderId = function() {
    sheet.getRange(config.trailingStopOrderIdCell).getValues()[0][0];
  };
  this.setTrailingStopOrderId = function(orderId) {
    sheet.getRange(config.trailingStopOrderIdCell).setValues([[orderId]]);
  };
  
  this.hasStopLoss = function() {
    return self.getStopLossPercent() < 0;
  }
  this.hasTakeProfit1 = function() {
    return self.getTakeProfitPercent1() > 0;
  }
  this.hasTakeProfit2 = function() {
    return self.getTakeProfitPercent2() > 0;
  }
  this.hasTakeProfit3 = function() {
    return self.getTakeProfitPercent3() > 0;
  }
  this.hasTrailingStop = function() {
    return self.getTrailingStopTrigger() > 0;
  }
  
  this.getTakeProfitCount = function() {
    var count = 0;
    if (self.hasTakeProfit1()) {
      count++;
    }
    if (self.hasTakeProfit2()) {
      count++;
    }
    if (self.hasTakeProfit3()) {
      count++;
    }
    if (self.hasTrailingStop()) {
      count++;
    }
    return count;
  };
  
  
};