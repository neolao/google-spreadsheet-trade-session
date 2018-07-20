var TradeSession_DateFormatter = function(date) {
    
  var twoDigit = function(value) {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };
  
  this.formatLong = function() {
    var formatted = twoDigit(date.getDate());
    formatted += "/";
    formatted += twoDigit(date.getMonth() + 1);
    formatted += "/";
    formatted += date.getYear();
    formatted += " ";
    formatted += twoDigit(date.getHours());
    formatted += ":";
    formatted += twoDigit(date.getMinutes());
    formatted += ":";
    formatted += twoDigit(date.getSeconds());
    return formatted;
  };
};