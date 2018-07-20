var TradeSession_History = function(range) {
  var values = range.getValues();
  var rowCount = values.length;
  var columnCount = values[0].length;
  
  this.clear = function() {
    var newValues = [];
    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      var newRow = [];
      for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        newRow.push(null);
      }
      newValues.push(newRow);
    }
    range.setValues(newValues);
  };
  
  this.push = function(message) {
    var now = new Date();
    var currentValues = range.getValues();
    var newValues = currentValues.slice();
    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      if (!currentValues[rowIndex][0]) {
        newValues[rowIndex][0] = now;
        newValues[rowIndex][columnCount - 1] = message;
        break;
      }
    }
    range.setValues(newValues);
  };
};
