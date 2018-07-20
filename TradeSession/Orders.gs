var TradeSession_Orders = function(range, exchange, baseAsset, quoteAsset) {
  var rowCount = range.getValues().length;
  var columnCount = range.getValues()[0].length;
  var emptyRow = [];
  for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    emptyRow.push(null);
  }
  
  var denormalizeOrder = function(normalizedOrder) {
    var id = normalizedOrder[0];
    var side = normalizedOrder[2];
    var type = normalizedOrder[4];
    var price = normalizedOrder[8];
    var baseQuantity = normalizedOrder[12];
    var quoteQuantity = normalizedOrder[16];
    var status = normalizedOrder[19];
      
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
      null,
      order.side,
      null,
      order.type,
      null,
      null,
      null,
      order.price,
      null,
      null,
      null,
      order.baseQuantity,
      null,
      null,
      null,
      order.quoteQuantity,
      null,
      null,
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
  
  this.getRemainingQuoteQuantity = function() {
    
  };
  
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
  };
};