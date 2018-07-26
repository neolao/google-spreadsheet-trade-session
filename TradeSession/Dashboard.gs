var TradeSession_Dashboard = function(sheet) {
  var self = this;
  var cells = {
    exchangeName: 'C3',
    baseAsset: 'C4',
    quoteAsset: 'C5',
    quoteQuantity: 'C6',
    buyStrategy: 'C7',
    buyPrice: 'C8',
    stopLoss: 'C9',
    takeProfit1: 'C10',
    takeProfit2: 'C11',
    takeProfit3: 'C12',
    trailingStopTrigger: 'C13',
    trailingStopThreshold: 'C14',
    
    startDate: 'E3',
    endDate: 'G3',
    
    received: 'F6',
    remaining: 'H6',
    profit: 'J6',
    
    ticker: 'F8',
    diffPrice: 'H8',
    highestPrice: 'J8',
    
    stopLossOrderId: 'F9',
    takeProfitOrderId1: 'F10',
    takeProfitOrderId3: 'F11',
    takeProfitOrderId2: 'F12',
    trailingStopOrderId: 'F13',

    ordersRange: 'B18:I26',
    historyRange: 'B30:C51'
  };
  
  var denormalizePercent = function(normalizedValue) {
    if (normalizedValue == 'None') {
      return null;
    }
    return normalizedValue;
  };
  var getCellValue = function(cell) {
    return sheet.getRange(cell).getValues()[0][0];
  }
  var setCellValue = function(cell, value) {
    sheet.getRange(cell).setValues([[value]]);
  }
  
  this.getExchangeName = function() {
    return getCellValue(cells.exchangeName);
  }
  this.getBaseAsset = function() {
    return getCellValue(cells.baseAsset);
  }
  this.getQuoteAsset = function() {
    return getCellValue(cells.quoteAsset);
  }
  this.getQuoteQuantity = function() {
    return getCellValue(cells.quoteQuantity);
  }
  
  this.getHistoryRange = function() {
    return sheet.getRange(cells.historyRange);
  }
  this.getOrdersRange = function() {
    return sheet.getRange(cells.ordersRange);
  }
  
  
  
  this.getStartDate = function() {
    return getCellValue(cells.startDate);
  }
  this.setStartDate = function(date) {
    setCellValue(cells.startDate, date);
  };
  
  this.getEndDate = function() {
    return getCellValue(cells.endDate);
  };
  this.setEndDate = function(date) {
    setCellValue(cells.endDate, date);
  };
  
  this.getBuyPrice = function(price) {
    return getCellValue(cells.buyPrice);
  };
  this.setBuyPrice = function(price) {
    setCellValue(cells.buyPrice, price);
  };
  
  this.getTicker = function() {
    return getCellValue(cells.ticker);
  };
  this.setTicker = function(ticker) {
    setCellValue(cells.ticker, ticker);
  };
  
  this.getHighestPrice = function() {
    return sheet.getRange(cells.highestPrice);
  };
  this.setHighestPrice = function(price) {
    setCellValue(cells.highestPrice, price);
  };
  
  this.getStopLossPercent = function() {
    return denormalizePercent(getCellValue(cells.stopLoss));
  };
  this.getStopLossOrderId = function() {
    return getCellValue(cells.stopLossOrderId);
  };
  this.setStopLossOrderId = function(orderId) {
    setCellValue(cells.stopLossOrderId, orderId);
  };
  
  this.getTakeProfitPercent1 = function() {
    return denormalizePercent(getCellValue(cells.takeProfit1));
  };
  this.getTakeProfitOrderId1 = function() {
    return getCellValue(cells.takeProfitOrderId1);
  };
  this.setTakeProfitOrderId1 = function(orderId) {
    setCellValue(cells.takeProfitOrderId1, orderId);
  };
  
  this.getTakeProfitPercent2 = function() {
    return denormalizePercent(getCellValue(cells.takeProfit2));
  };
  this.getTakeProfitOrderId2 = function() {
    return getCellValue(cells.takeProfitOrderId2);
  };
  this.setTakeProfitOrderId2 = function(orderId) {
    setCellValue(cells.takeProfitOrderId2, orderId);
  };
  
  this.getTakeProfitPercent3 = function() {
    return denormalizePercent(getCellValue(cells.takeProfit3));
  };
  this.getTakeProfitOrderId3 = function() {
    return getCellValue(cells.takeProfitOrderId3);
  };
  this.setTakeProfitOrderId3 = function(orderId) {
    setCellValue(cells.takeProfitOrderId3, orderId);
  };
  
  
  this.getTrailingStopTrigger = function() {
    return denormalizePercent(getCellValue(cells.trailingStopTrigger));
  };
  this.getTrailingStopThreshold = function() {
    return denormalizePercent(getCellValue(cells.trailingStopThreshold));
  };
  this.getTrailingStopOrderId = function() {
    return getCellValue(cells.trailingStopOrderId);
  };
  this.setTrailingStopOrderId = function(orderId) {
    setCellValue(cells.trailingStopOrderId, orderId);
  };
  
  this.hasStartDate = function() {
    return Boolean(self.getStartDate());
  }
  this.hasEndDate = function() {
    return Boolean(self.getEndDate());
  }
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