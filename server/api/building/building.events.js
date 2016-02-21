/**
 * Building model events
 */

'use strict';

import {EventEmitter} from 'events';
var Building = require('./building.model');
var BuildingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BuildingEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Building.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BuildingEvents.emit(event + ':' + doc._id, doc);
    BuildingEvents.emit(event, doc);
  }
}

export default BuildingEvents;
