var TradeSession_Orders = function(range, exchange, baseAsset, quoteAsset) {
  var rowCount = range.getValues().length;
  var columnCount = range.getValues()[0].length;
  var emptyRow = [];
  var self = this;
  for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    emptyRow.push(null);
  }

  var denormalizeOrder = function(normalizedOrder) {
    var id = normalizedOrder[0];
    var time = (new Date()).getTime();
    if (normalizedOrder[1]) {
      time = (new Date(normalizedOrder[1])).getTime();
    }
    var side = normalizedOrder[3];
    var type = normalizedOrder[4];
    var price = normalizedOrder[5];
    var baseQuantity = normalizedOrder[6];
    var quoteQuantity = normalizedOrder[7];
    var status = normalizedOrder[8];

    return new Exchange_Order(
      id,
      time,
      side,
      type,
      price,
      baseQuantity,
      quoteQuantity,
      status
    );
  };
  var normalizeOrder = function(order) {
    return [
      order.id,
      new Date(order.time),
      null,
      order.side,
      order.type,
      order.price,
      order.baseQuantity,
      order.quoteQuantity,
      order.status
    ];
  };

  var getOrdersFromRange = function() {
    var normalizedOrders = range.getValues();
    var orders = [];
    for (var index = 0; index < rowCount; index++) {
      if (!normalizedOrders[index][0]) {
        continue;
      }
      try {
        orders.push(denormalizeOrder(normalizedOrders[index]));
      } catch (error) {
        // Unable to denormalize
        console.log({message: "Unable to denormalize order", normalized: normalizedOrders[index], errorMessage: error.message});
      }
    }
    return orders;
  };

  var setOrdersToRange = function(orders) {
    var normalizedOrders = [];
    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      if (rowIndex < orders.length) {
        var order = orders[rowIndex];
        normalizedOrders.push(normalizeOrder(order));
      } else {
        normalizedOrders.push(emptyRow);
      }
    }
    range.setValues(normalizedOrders);
  };

  var getOldestStartTime = function() {
    var startTime = (new Date()).getTime();
    var normalizedOrders = range.getValues();
    var orders = [];
    for (var index = 0; index < rowCount; index++) {
      if (!normalizedOrders[index][0]) {
        continue;
      }
      var orderStartTime = (new Date(normalizedOrders[index][1])).getTime();
      if (orderStartTime < startTime) {
        startTime = orderStartTime;
      }
    }

    return startTime;
  };

  this.add = function(order) {
    var orders = getOrdersFromRange();
    orders.push(order);
    setOrdersToRange(orders);
  };

  this.hasOpenOrders = function() {
    var orders = getOrdersFromRange();
    for (var index = 0; index < orders.length; index++) {
      if (orders[index].status === Exchange_Order_Status_New || orders[index].status === Exchange_Order_Status_Partial) {
        return true;
      }
    }
    return false;
  };

  this.refresh = function() {
    // Do not refresh if there is no open orders
    if (!self.hasOpenOrders()) {
      //console.log({message: "No refresh, there is no open orders", initialData: getOrdersFromRange()});
      return;
    }

    var orders = getOrdersFromRange();
    //console.log({message: "Refresh orders "+baseAsset+"/"+quoteAsset, initialData: orders});
    //console.time("Refresh orders");
    var refreshedOrders = exchange.executeQuery(new Exchange_Query_GetRefreshedOrders(baseAsset, quoteAsset, orders));
    console.log({message: "Refreshed orders "+baseAsset+"/"+quoteAsset, orders: orders, refreshedOrders: refreshedOrders});
    //console.timeEnd("Refresh orders");

    // Update orders
    for (var index = 0; index < orders.length; index++) {
      for (var refreshedIndex = 0; refreshedIndex < refreshedOrders.length; refreshedIndex++) {
        if (orders[index].id == refreshedOrders[refreshedIndex].id) {
          orders[index] = refreshedOrders[refreshedIndex];
        }
      }
    }
    setOrdersToRange(orders);
  };

  this.clear = function() {
    setOrdersToRange([]);
  };

  this.getQuoteSent = function() {
    var orders = getOrdersFromRange();
    var spent = 0;
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];
      if (order.status !== Exchange_Order_Status_Filled) {
        continue;
      }

      if (order.side === Exchange_Order_Side_Buy) {
        spent += order.quoteQuantity;
      }
    }

    return spent;
  };

  this.getQuoteReceived = function() {
    var orders = getOrdersFromRange();
    var received = 0;
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];
      if (order.status !== Exchange_Order_Status_Filled) {
        continue;
      }

      if (order.side === Exchange_Order_Side_Sell) {
        received += order.quoteQuantity;
      }
    }

    return received;
  };

  // TODO handle partial filled orders
  this.getRemainingBaseQuantity = function() {
    var orders = getOrdersFromRange();
    var remainingQuantity = 0;
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];
      if (order.status !== Exchange_Order_Status_Filled) {
        continue;
      }

      if (order.side === Exchange_Order_Side_Buy) {
        remainingQuantity += order.baseQuantity;
      } else {
        remainingQuantity -= order.baseQuantity;
      }
    }

    return remainingQuantity;
  }

  this.cancelAll = function() {
    var orders = getOrdersFromRange();
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];

      if (order.status !== Exchange_Order_Status_Filled && order.status !== Exchange_Order_Status_Canceled) {
        exchange.executeCommand(new Exchange_Command_CancelOrder(baseAsset, quoteAsset, order.id));

        // Optimistic update
        order.status = Exchange_Order_Status_Canceled;
      }
      orders[index] = order;
    }
  }

  this.getById = function(orderId) {
    var orders = getOrdersFromRange();
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];

      if (order.id == orderId) {
        return order;
      }
    }

    throw new Error('Order not found: "'+orderId+'"');
  }

  this.getAverageSellPrice = function() {
    var orders = getOrdersFromRange();
    var sumQuantity = 0;
    var sumPrice = 0;
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];

      if ((order.side === Exchange_Order_Side_Sell) && (order.status === Exchange_Order_Status_Filled)) {
        sumQuantity += order.quoteQuantity;
        sumPrice += order.price * order.quoteQuantity;
      }
    }
    if (sumQuantity > 0) {
      return sumPrice / sumQuantity;
    }

    return 0;
  }

  this.isFilled = function(orderId) {
    try {
      var order = self.getById(orderId);
      return (order.status === Exchange_Order_Status_Filled);
    } catch (error) {
      return false;
    }
  }
};
