function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Add menu
  ui
    .createMenu('Trade sessions')
    .addItem('Refresh all sessions', 'refreshAll')
    .addSeparator()
    .addSubMenu(
      ui.createMenu('Settings')
        .addItem('Update Binance API key', 'updateBinanceSettings')
        .addItem('Display Binance API key', 'displayBinanceSettings')
    )
    .addToUi();
    
  // Install triggers
  var triggers = ScriptApp.getUserTriggers(spreadsheet);
  var hasTriggerRefreshAll = false;
  for (var index = 0; index < triggers.length; index++) {
    var handlerFunction = triggers[index].getHandlerFunction();
    if (handlerFunction === 'refreshAll') {
      hasTriggerRefreshAll = true;
    }
  }
  if (!hasTriggerRefreshAll) {
    ScriptApp.newTrigger('refreshAll')
      .timeBased()
      .everyMinutes(1)
      .create();
  }
  
  spreadsheet.toast('Initialized', 'Trade Session', 10);
}

function createCurrentSession() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var session = new TradeSession(sheet);
  return session;
}

function buyCurrentSession() {
    createCurrentSession().buy();
}

function refreshSheet(sheet) {
    Logger.log("Refresh: "+sheet.getName());
}

function refreshAll() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = spreadsheet.getSheets();
    for (var index = 0; index < sheets.length; index++) {
        var sheet = sheets[index];
        var sheetName = sheet.getName();
        if (sheetName.search(/^.* Session$/) != -1) {
            refreshSheet(sheet);
        }
    }
}