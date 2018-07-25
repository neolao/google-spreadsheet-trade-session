function createNEOSession() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("NEO Session");
  var config = getConfig();
  var exchange = new Binance(config.binance_api_key, config.binance_api_secret);
  var session = new TradeSession(
    exchange,
    "NEO",
    "USDT",
    sheet,
    {
      quoteQuantityCell: "B3",
      buyPriceCell: "F3",
      currentPriceCell: "J3",
      highestPriceCell: "N3",
      
      startDateCell: "R3",
      endDateCell: "U3",
      
      stopLossPercentCell: "B6",
      stopLossOrderIdCell: "C6",
      stopLossStatusCell: "D6",
      
      takeProfitPercent1Cell: "F6",
      takeProfitOrderId1Cell: "G6",
      takeProfitStatus1Cell: "H6",
      
      takeProfitPercent2Cell: "J6",
      takeProfitOrderId2Cell: "K6",
      takeProfitStatus2Cell: "L6",
      
      takeProfitPercent3Cell: "N6",
      takeProfitOrderId3Cell: "O6",
      takeProfitStatus3Cell: "P6",
      
      trailingStopTriggerCell: "R6",
      trailingStopThresholdCell: "S6",
      trailingStopOrderIdCell: "T6",
      trailingStopStatusCell: "U6",
      
      ordersRange: "B11:U16",
      historyRange: "B19:E29"
    }
  );
  
  return session;
}

function buyNEO() {
  createNEOSession().buy();
}

function clearNEO() {
  createNEOSession().clear();
}

function refreshNEO() {
  createNEOSession().refresh();
}

function cancelNEO() {
  createNEOSession().cancel();
}
