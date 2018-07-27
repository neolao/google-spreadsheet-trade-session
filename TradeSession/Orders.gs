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
    var side = normalizedOrder[1];
    var type = normalizedOrder[3];
    var price = normalizedOrder[4];
    var baseQuantity = normalizedOrder[5];
    var quoteQuantity = normalizedOrder[6];
    var status = normalizedOrder[7];
      
    return new Exchange_Order(
      id,
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
      order.side,
      null,
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
      orders.push(denormalizeOrder(normalizedOrders[index]));
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
  
  this.add = function(order) {
    var orders = getOrdersFromRange();
    orders.push(order);
    setOrdersToRange(orders);
  };
  
  this.refresh = function() {
    var orders = getOrdersFromRange();
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];
      
      var refreshedOrder = exchange.executeQuery(new Exchange_Query_GetOrder(baseAsset, quoteAsset, order.id));
      orders[index] = refreshedOrder;
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
        order = exchange.executeQuery(new Exchange_Query_GetOrder(baseAsset, quoteAsset, order.id));
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
  
  this.isFilled = function(orderId) {
    try {
      var order = self.getById(orderId);
      return order.status === Exchange_Order_Status_Filled;
    } catch (error) {
      return false;
    }
  }
};