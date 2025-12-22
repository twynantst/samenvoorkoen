function count(slot, slot_range, count_range) {
  // Debug logging
  Logger.log("slot: " + slot);
  Logger.log("slot_range: " + JSON.stringify(slot_range));
  Logger.log("count_range: " + JSON.stringify(count_range));
  
  // Check of de parameters geldig zijn
  if (!slot_range || !count_range) {
    return "ERROR: Missing range";
  }
  
  // Als slot_range geen array is, converteer het
  if (!Array.isArray(slot_range)) {
    slot_range = [[slot_range]];
  }
  if (!Array.isArray(count_range)) {
    count_range = [[count_range]];
  }
  
  var total = 0;
  
  // Loop door de slot_range
  for (var i = 0; i < slot_range.length; i++) {
    // Als het huidige slot gelijk is aan het input slot
    if (slot_range[i][0] === slot) {
      // Tel de count van de count_range op
      var countValue = parseInt(count_range[i][0]) || 0;
      total += countValue;
    }
  }
  
  return total;
}