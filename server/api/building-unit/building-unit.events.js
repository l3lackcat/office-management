/**
 * BuildingUnit model events
 */

'use strict';

import {EventEmitter} from 'events';
var BuildingUnit = require('./building-unit.model');
var BuildingUnitEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BuildingUnitEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  BuildingUnit.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BuildingUnitEvents.emit(event + ':' + doc._id, doc);
    BuildingUnitEvents.emit(event, doc);
  }
}

export default BuildingUnitEvents;
