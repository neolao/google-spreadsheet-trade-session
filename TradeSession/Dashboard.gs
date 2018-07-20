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
  this.setStopLossOrderId = function(orderId) {
    sheet.getRange(config.stopLossOrderIdCell).setValues([[orderId]]);
  };
  
  this.getTakeProfitPercent1 = function() {
    return denormalizePercent(sheet.getRange(config.takeProfitPercent1Cell).getValues()[0][0]);
  };
  this.setTakeProfitOrderId1 = function(orderId) {
    sheet.getRange(config.takeProfitOrderId1Cell).setValues([[orderId]]);
  };
  
  this.getTakeProfitPercent2 = function() {
    return denormalizePercent(sheet.getRange(config.takeProfitPercent2Cell).getValues()[0][0]);
  };
  this.setTakeProfitOrderId2 = function(orderId) {
    sheet.getRange(config.takeProfitOrderId2Cell).setValues([[orderId]]);
  };
  
  this.getTakeProfitPercent3 = function() {
    return denormalizePercent(sheet.getRange(config.takeProfitPercent3Cell).getValues()[0][0]);
  };
  this.setTakeProfitOrderId3 = function(orderId) {
    sheet.getRange(config.takeProfitOrderId3Cell).setValues([[orderId]]);
  };
  
  this.getTrailingStopTrigger = function() {
    return denormalizePercent(sheet.getRange(config.trailingStopTriggerCell).getValues()[0][0]);
  };
  
  this.getTakeProfitCount = function() {
    var count = 0;
    if (self.getTakeProfitPercent1() > 0) {
      count++;
    }
    if (self.getTakeProfitPercent2() > 0) {
      count++;
    }
    if (self.getTakeProfitPercent3() > 0) {
      count++;
    }
    if (self.getTrailingStopTrigger() > 0) {
      count++;
    }
    return count;
  };
};