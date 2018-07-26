function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  
  // Add menu
  ui
    .createMenu('Trade sessions')
    .addItem('Refresh all sessions', 'refreshAll')
    .addSeparator()
    .addSubMenu(
      ui.createMenu('Settings')
        .addItem('Install', 'install')
        .addItem('Display Binance API key', 'displayBinanceSettings')
        .addItem('Display Binance API key', 'displayBinanceSettings')
    )
    .addToUi();
}

function install() {
  var ui = SpreadsheetApp.getUi();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
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
  
  spreadsheet.toast('Installed', 'Trade Session', 10);
}

function createCurrentSession() {
  var sheet = SpreadsheetApp.getActiveSheet();
  return createSheetSession(sheet);
}
function createSheetSession(sheet) {
  var session = new TradeSession(sheet);
  return session;
}

function buyCurrentSession() {
    createCurrentSession().buy();
}

function refreshCurrentSession() {
    createCurrentSession().refresh();
}
function refreshSheetSession(sheet) {
    createSheetSession(sheet).refresh();
}

function clearCurrentSession() {
    createCurrentSession().clear();
}
function clearSheetSession(sheet) {
    createSheetSession(sheet).clear();
}

function cancelCurrentSession() {
    createCurrentSession().cancel();
}
function cancelSheetSession(sheet) {
    createSheetSession(sheet).cancel();
}

function refreshAll() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = spreadsheet.getSheets();
    for (var index = 0; index < sheets.length; index++) {
        var sheet = sheets[index];
        var sheetName = sheet.getName();
        if (sheetName.search(/^.* Session$/) != -1) {
            refreshSheetSession(sheet);
        }
    }
}