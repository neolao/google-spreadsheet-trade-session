var TradeSession = function(sheet) {
  var self = this;
  var dashboard = new TradeSession_Dashboard(sheet);
  var exchangeName = dashboard.getExchangeName();
  var exchange = TradeSession_ExchangeBuilder.build(exchangeName);
  var baseAsset = dashboard.getBaseAsset();
  var quoteAsset = dashboard.getQuoteAsset();
  var history = new TradeSession_History(dashboard.getHistoryRange());
  var orders = new TradeSession_Orders(dashboard.getOrdersRange(), exchange, baseAsset, quoteAsset);
  var eventListeners = [];

  var start = function() {
    var date = new Date();
    dashboard.setStartDate(date);

    dispatchEvent(EVENT_STARTED, {
      date: date
    });

    return date;
  };

  var end = function() {
    var date = new Date();
    var quoteSpent = orders.getQuoteSent();
    var quoteReceived = orders.getQuoteReceived();
    dashboard.setEndDate(date);
    dashboard.setQuoteReceived(quoteSpent);
    dashboard.setRemainingBaseQuantity(quoteReceived);
    dashboard.setProfitQuantity(quoteReceived - quoteSpent);

    dispatchEvent(EVENT_ENDED, {
      startDate: dashboard.getStartDate(),
      endDate: date,
      baseAsset: baseAsset,
      quoteAsset: quoteAsset,
      quoteSpent: quoteSpent,
      quoteReceived: quoteReceived
    });

    history.push("Session finished");

    return date;
  };

  var buyAtMarket = function() {
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
  var buyAtLimit = function() {
    var quoteQuantity = dashboard.getQuoteQuantity();
    var buyPrice = dashboard.getBuyPrice();

    history.push("Create buy order for " + quoteQuantity + " " + quoteAsset + " at " + buyPrice + " " + quoteAsset + " ...");
    try {
      var order = exchange.executeCommand(new Exchange_Command_BuyAtLimitByQuoteQuantity(baseAsset, quoteAsset, quoteQuantity, buyPrice));
      history.push("Buy order executed: "+order.id+", price "+order.price+", baseQuantity "+order.baseQuantity);
      return order;
    } catch (error) {
      history.push("Fail to buy: " + error.message);
      throw error;
    }
  };
  var sellAtLimit = function(baseQuantity, price) {
    try {
      return exchange.executeCommand(new Exchange_Command_SellAtLimit(baseAsset, quoteAsset, baseQuantity, price));
    } catch (error) {
      history.push("Fail to create sell order: " + error.message);
      throw error;
    }
  };
  var sellRemainingQuantityAtMarket = function() {
    var remaining = orders.getRemainingBaseQuantity();
    history.push("Sell remaining base quantity: "+remaining);

    try {
      var order = exchange.executeCommand(new Exchange_Command_SellAtMarket(baseAsset, quoteAsset, remaining));
      history.push("Sell order executed: "+order.id+", price "+order.price+", baseQuantity "+order.baseQuantity);
      return order;
    } catch (error) {
      history.push("Fail to create sell order: " + error.message);
      throw error;
    }
  };
  var isBuyOrderFilled = function() {
    var buyOrderId = dashboard.getBuyOrderId();
    if (orders.isFilled(buyOrderId)) {
      return true;
    }

    return false;
  };
  var areSellOrdersMissing = function() {
    var expectedOrderCount = dashboard.getTakeProfitCount();
    var orderCount = 0;
    if (dashboard.hasTakeProfit1() && dashboard.getTakeProfitOrderId1()) {
      orderCount++;
    }
    if (dashboard.hasTakeProfit2() && dashboard.getTakeProfitOrderId2()) {
      orderCount++;
    }
    if (dashboard.hasTakeProfit3() && dashboard.getTakeProfitOrderId3()) {
      orderCount++;
    }
    if (dashboard.hasTrailingStop() && dashboard.getTrailingStopOrderId()) {
      orderCount++;
    }
    if (orderCount < expectedOrderCount) {
      return true;
    }

    return false;
  };
  var createSellOrders = function() {
    var buyOrder = orders.getById(dashboard.getBuyOrderId());
    var takeProfitCount = dashboard.getTakeProfitCount();
    var dividedQuantity = buyOrder.baseQuantity / takeProfitCount;
    var buyPrice = buyOrder.price;

    // Create take profit order 1
    var takeProfitPercent1 = dashboard.getTakeProfitPercent1();
    if (takeProfitPercent1 && !dashboard.getTakeProfitOrderId1()) {
      var sellOrder1 = sellAtLimit(dividedQuantity, buyPrice * (1 + takeProfitPercent1));
      dashboard.setTakeProfitOrderId1(sellOrder1.id);
      orders.add(sellOrder1);

      history.push("Sell order "+(takeProfitPercent1 * 100)+"% executed: "+sellOrder1.id+", price "+sellOrder1.price+", baseQuantity "+sellOrder1.baseQuantity);
    }

    // Create take profit order 2
    var takeProfitPercent2 = dashboard.getTakeProfitPercent2();
    if (takeProfitPercent2 && !dashboard.getTakeProfitOrderId2()) {
      var sellOrder2 = sellAtLimit(dividedQuantity, buyPrice * (1 + takeProfitPercent2));
      dashboard.setTakeProfitOrderId2(sellOrder2.id);
      orders.add(sellOrder2);

      history.push("Sell order "+(takeProfitPercent2 * 100)+"% executed: "+sellOrder2.id+", price "+sellOrder2.price+", baseQuantity "+sellOrder2.baseQuantity);
    }

    // Create take profit order 3
    var takeProfitPercent3 = dashboard.getTakeProfitPercent3();
    if (takeProfitPercent3 && !dashboard.getTakeProfitOrderId3()) {
      var sellOrder3 = sellAtLimit(dividedQuantity, buyPrice * (1 + takeProfitPercent3));
      dashboard.setTakeProfitOrderId3(sellOrder3.id);
      orders.add(sellOrder3);

      history.push("Sell order "+(takeProfitPercent3 * 100)+"% executed: "+sellOrder3.id+", price "+sellOrder3.price+", baseQuantity "+sellOrder3.baseQuantity);
    }

    start();
    //var startDate = start();
    //var startDateString = (new TradeSession_DateFormatter(startDate)).formatLong();
  };


  var dispatchEvent = function(type, event) {
    for (var index = 0; index < eventListeners.length; index++) {
      var listenerType = eventListeners[index].type;
      if (listenerType === type) {
        eventListeners[index].listener(event);
      }
    }
  };
  this.addEventListener = function(eventType, listener) {
    eventListeners.push({type: eventType, listener: listener});
  }

  this.clear = function() {
    dashboard.setBuyOrderId(null);
    dashboard.setHighestPrice(0);
    dashboard.setStartDate(null);
    dashboard.setEndDate(null);
    dashboard.setStopLossOrderId(null);
    dashboard.setTakeProfitOrderId1(null);
    dashboard.setTakeProfitOrderId2(null);
    dashboard.setTakeProfitOrderId3(null);
    dashboard.setTrailingStopOrderId(null);
    dashboard.setQuoteReceived(null);
    dashboard.setRemainingBaseQuantity(null);
    dashboard.setProfitQuantity(null);
    dashboard.setAverageSellPrice(null);
    orders.clear();
    history.clear();
  }

  this.buy = function() {
    var ui = SpreadsheetApp.getUi();
    var buyStrategy = dashboard.getBuyStrategy();
    var quoteQuantity = dashboard.getQuoteQuantity();
    var warningMessage = 'Buy '+baseAsset+'/'+quoteAsset+' with '+quoteQuantity+' '+quoteAsset;
    if (buyStrategy === 'Limit') {
      var buyPrice = dashboard.getBuyPrice();
      warningMessage += ' at '+buyPrice+' '+quoteAsset;
    } else {
      warningMessage += ' at market price';
    }
    warningMessage += '?';
    var response = ui.alert(warningMessage, ui.ButtonSet.YES_NO);
    if (response != ui.Button.YES) {
      return;
    }

    self.clear();

    if (buyStrategy === 'Market') {
      var buyOrder = buyAtMarket();
      orders.add(buyOrder);
      dashboard.setBuyOrderId(buyOrder.id);
    } else if (buyStrategy === 'Limit') {
      var buyOrder = buyAtLimit();
      orders.add(buyOrder);
      dashboard.setBuyOrderId(buyOrder.id);
    }

    if (isBuyOrderFilled()) {
      createSellOrders();
    }
  };

  this.cancel = function() {
    orders.cancelAll();

    var sellOrder = sellRemainingQuantityAtMarket();
    orders.add(sellOrder);

    end();
  }

  this.isFinished = function() {
    if (!dashboard.hasStartDate()) {
      return true;
    }

    if (dashboard.hasEndDate()) {
      return true;
    }

    if (dashboard.hasStopLoss()) {
      var stopLossOrderId = dashboard.getStopLossOrderId();
      if (orders.isFilled(stopLossOrderId)) {
        return true;
      }
    }

    var expectedFilled = dashboard.getTakeProfitCount();
    if (expectedFilled == 0) {
      // Without take profit setup, the session is never finished
      return false;
    }

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

    // Update highest price
    if (!isFinished && currentPrice > highestPrice) {
      dashboard.setHighestPrice(currentPrice);
    }

    // Update quote spent and remaining quote quantity
    dashboard.setQuoteReceived(orders.getQuoteReceived());
    dashboard.setRemainingBaseQuantity(orders.getRemainingBaseQuantity());
    var averageSellPrice = orders.getAverageSellPrice();
    if (averageSellPrice > 0) {
      dashboard.setAverageSellPrice(averageSellPrice);
    }

    // Check stop loss
    if (!isFinished && dashboard.hasStopLoss()) {
      var stopLossPercent = dashboard.getStopLossPercent();
      var stopLossPrice = buyPrice * (1 + stopLossPercent);
      if (currentPrice <= stopLossPrice) {
        history.push("😱 STOP LOSS 😱 Current price "+currentPrice+" "+quoteAsset+", Limit "+stopLossPrice+" "+quoteAsset);

        try {
          orders.cancelAll();

          var sellOrder = sellRemainingQuantityAtMarket();
          dashboard.setStopLossOrderId(sellOrder.id);
          orders.add(sellOrder);
        } catch (error) {
          end();

          history.push("ERROR "+error.message);
          throw error;
        }
      }
    }

    // Check trailing stop
    if (!isFinished && dashboard.hasTrailingStop()) {
      var trailingStopTrigger = dashboard.getTrailingStopTrigger();
      var trailingStopThreshold = dashboard.getTrailingStopThreshold();
      var triggerPrice = buyPrice * (1 + trailingStopTrigger);
      var thresholdPrice = highestPrice * (1 + trailingStopThreshold);
      if (highestPrice >= triggerPrice && currentPrice <= thresholdPrice) {
        history.push("TRAILING STOP! Current price "+currentPrice+" "+quoteAsset+", Threshold "+thresholdPrice+" "+quoteAsset);

        try {
          orders.cancelAll();

          var sellOrder = sellRemainingQuantityAtMarket();
          dashboard.setTrailingStopOrderId(sellOrder.id);
          orders.add(sellOrder);
        } catch (error) {
          end();

          history.push("ERROR "+error.message);
          throw error;
        }
      }
    }

    // Refresh orders
    orders.refresh();

    // Create sell orders
    if (areSellOrdersMissing() && isBuyOrderFilled()) {
      createSellOrders();
    }

    // Check end
    if (dashboard.hasStartDate() && !dashboard.hasEndDate() && self.isFinished()) {
      end();
    }
  }
}
