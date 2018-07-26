var TradeSession = function(sheet) {
  var self = this;
  var dashboard = new TradeSession_Dashboard(sheet);
  var exchangeName = dashboard.getExchangeName();
  var exchange = TradeSession_ExchangeBuilder.build(exchangeName);
  var baseAsset = dashboard.getBaseAsset();
  var quoteAsset = dashboard.getQuoteAsset();
  var history = new TradeSession_History(dashboard.getHistoryRange());
  var orders = new TradeSession_Orders(dashboard.getOrdersRange(), exchange, baseAsset, quoteAsset);
  
  var createStartDate = function() {
    var date = new Date();
    dashboard.setStartDate(date);
    return date;
  };
  
  var createEndDate = function() {
    var date = new Date();
    dashboard.setEndDate(date);
    return date;
  };
  
  var buyAtMarket = function() {
    var startDate = createStartDate();
    var startDateString = (new TradeSession_DateFormatter(startDate)).formatLong();
    var quoteQuantity = dashboard.getQuoteQuantity();
    
    history.push("Start buying " + quoteQuantity + " " + quoteAsset + " ...");
    try {
      var order = exchange.executeCommand(new Exchange_Command_BuyAtMarketByQuoteQuantity(baseAsset, quoteAsset, quoteQuantity));
      dashboard.setBuyPrice(order.price);
      history.push("Buy order executed: "+order.id+", price "+order.price+", baseQuantity "+order.baseQuantity);
      return order;
    } catch (error) {
      history.push("Fail to buy: " + error.message);
      throw error;
    }
  };
  var sellAtLimit = function(baseQuantity, price) {
    try {
      var order = exchange.executeCommand(new Exchange_Command_SellAtLimit(baseAsset, quoteAsset, baseQuantity, price));
      history.push("Sell order executed: "+order.id+", price "+order.price+", baseQuantity "+order.baseQuantity);
      return order;
    } catch (error) {
      history.push("Fail to create sell order: " + error.message);
      throw error;
    }
  };
  var sellRemainingQuantityAtMarket = function() {
    var remainingQuoteQuantity = orders.getRemainingQuoteQuantity();
    history.push("Sell remaining quote quantity: "+remainingQuoteQuantity);
    
    try {
      var order = exchange.executeCommand(new Exchange_Command_SellAtMarketByQuoteQuantity(baseAsset, quoteAsset, remainingQuoteQuantity));
      history.push("Sell order executed: "+order.id+", price "+order.price+", baseQuantity "+order.baseQuantity);
      return order;
    } catch (error) {
      history.push("Fail to create sell order: " + error.message);
      throw error;
    }
  };
  
  this.clear = function() {
    dashboard.setBuyPrice(null);
    dashboard.setHighestPrice(null);
    dashboard.setStartDate(null);
    dashboard.setEndDate(null);
    dashboard.setStopLossOrderId(null);
    dashboard.setTakeProfitOrderId1(null);
    dashboard.setTakeProfitOrderId2(null);
    dashboard.setTakeProfitOrderId3(null);
    dashboard.setTrailingStopOrderId(null);
    orders.clear();
    history.clear();
  }
  
  this.buy = function() {
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('BUY '+sheet.getName(), ui.ButtonSet.YES_NO);
    if (response == ui.Button.YES) {
      Logger.log('The user\'s name is %s.', response.getResponseText());
    }
    
    history.clear();
    var buyOrder = buyAtMarket();
    orders.add(buyOrder);
    
    var takeProfitCount = dashboard.getTakeProfitCount();
    var dividedQuantity = buyOrder.baseQuantity / takeProfitCount;
    var buyPrice = buyOrder.price;
    
    // Create take profit order 1
    var takeProfitPercent1 = dashboard.getTakeProfitPercent1();
    if (takeProfitPercent1) {
      var sellOrder1 = sellAtLimit(dividedQuantity, buyPrice * (1 + takeProfitPercent1));
      dashboard.setTakeProfitOrderId1(sellOrder1.id);
      orders.add(sellOrder1);
    }
    
    // Create take profit order 2
    var takeProfitPercent2 = dashboard.getTakeProfitPercent2();
    if (takeProfitPercent2) {
      var sellOrder2 = sellAtLimit(dividedQuantity, buyPrice * (1 + takeProfitPercent2));
      dashboard.setTakeProfitOrderId2(sellOrder2.id);
      orders.add(sellOrder2);
    }
    
    // Create take profit order 3
    var takeProfitPercent3 = dashboard.getTakeProfitPercent3();
    if (takeProfitPercent3) {
      var sellOrder3 = sellAtLimit(dividedQuantity, buyPrice * (1 + takeProfitPercent3));
      dashboard.setTakeProfitOrderId3(sellOrder3.id);
      orders.add(sellOrder3);
    }
  };
  
  this.cancel = function() {
    orders.cancelAll();
    
    var sellOrder = sellRemainingQuantityAtMarket();
    dashboard.setStopLossOrderId(sellOrder.id);
    orders.add(sellOrder);
  }
  
  this.isFinished = function() {
    if (!dashboard.hasStartDate()) {
      return true;
    }
    
    if (dashboard.hasStopLoss()) {
      var stopLossOrderId = dashboard.getStopLossOrderId();
      if (orders.isFilled(stopLossOrderId)) {
        return true;
      }
    }
    
    var expectedFilled = dashboard.getTakeProfitCount();
    var filledCount = 0;
    if (dashboard.hasTakeProfit1() && orders.isFilled(dashboard.getTakeProfitOrderId1())) {
      filledCount++;
    }
    if (dashboard.hasTakeProfit2() && orders.isFilled(dashboard.getTakeProfitOrderId2())) {
      filledCount++;
    }
    if (dashboard.hasTakeProfit3() && orders.isFilled(dashboard.getTakeProfitOrderId3())) {
      filledCount++;
    }
    if (dashboard.hasTrailingStop() && orders.isFilled(dashboard.getTrailingStopOrderId())) {
      filledCount++;
    }
    if (filledCount >= expectedFilled) {
      return true;
    }
    
    return false;
  }
  
  this.refresh = function() {
    // Update ticker
    var currentPrice = exchange.executeQuery(new Exchange_Query_GetPrice(baseAsset, quoteAsset));
    dashboard.setTicker(currentPrice);
    
    var buyPrice = dashboard.getBuyPrice();
    var highestPrice = dashboard.getHighestPrice();
    var isFinished = self.isFinished();
    if (isFinished) {
      return;
    }
    
    // Update highest price
    if (!highestPrice || currentPrice > highestPrice) {
      dashboard.setHighestPrice(currentPrice);
    }
    
    // Check stop loss
    if (dashboard.hasStopLoss()) {
      var stopLossPercent = dashboard.getStopLossPercent();
      var stopLossPrice = buyPrice * (1 + stopLossPercent);
      if (currentPrice <= stopLossPrice) {
        this.cancel();
        Utilities.sleep(1000);
      }
    }
    
    // Refresh orders
    orders.refresh();
    
    // Check end
    if (!dashboard.hasEndDate() && self.isFinished()) {
      createEndDate();
    }
  }
}