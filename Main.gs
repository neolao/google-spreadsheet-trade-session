var EVENT_STARTED = 'STARTED';
var EVENT_ENDED = 'ENDED';

/**
 * Executed when the Spreadsheet is open 
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  // Sub menu "Settings"
  var settings = ui.createMenu('Settings');
  settings.addItem('Install scheduler', 'TradeSession.installScheduler');
  settings.addSeparator();
  settings.addItem('Update Binance API key', 'TradeSession.updateBinanceSettings');
  settings.addItem('Display Binance API key', 'TradeSession.displayBinanceSettings');
  
  // Add menu
  ui
    .createMenu('Trade sessions')
    .addItem('Refresh all sessions', 'TradeSession.refreshAll')
    .addSeparator()
    .addSubMenu(settings)
    .addToUi();
}

function newSession(sheet) {
  return new TradeSession(sheet);
}


function isTriggerRefreshAllInstalled() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var triggers = ScriptApp.getUserTriggers(spreadsheet);
  for (var index = 0; index < triggers.length; index++) {
    var handlerFunction = triggers[index].getHandlerFunction();
    if (handlerFunction === 'refreshAll') {
      return true;
    }
  }
  
  return false;
}

function installScheduler() {
  var ui = SpreadsheetApp.getUi();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!isTriggerRefreshAllInstalled()) {
    ScriptApp.newTrigger('refreshAll')
      .timeBased()
      .everyMinutes(1)
      .create();
  }
  
  ui.alert('The scheduler is installed', ui.ButtonSet.OK);
  //spreadsheet.toast('Scheduler installed', 'Trade Session', 10);
}

function onSessionEnded(event) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var logs = spreadsheet.getSheetByName('Session logs');
  
  var startDate = event.startDate;
  var endDate = event.endDate;
  var baseAsset = event.baseAsset;
  var quoteAsset = event.quoteAsset;
  var quoteSpent = event.quoteSpent;
  var quoteReceived = event.quoteReceived;
  logs.appendRow([
    startDate,
    endDate,
    baseAsset,
    quoteAsset,
    quoteSpent,
    quoteReceived,
    quoteReceived / quoteSpent - 1
  ]);
}

function createCurrentSession() {
  var sheet = SpreadsheetApp.getActiveSheet();
  return createSheetSession(sheet);
}
function createSheetSession(sheet) {
  var session = new TradeSession.newSession(sheet);
  session.addEventListener(TradeSession.EVENT_ENDED, onSessionEnded);
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
