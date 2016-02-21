'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var RoomSchema = new mongoose.Schema({
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  unit: { type: String, default: '' },
  floor: { type: String, default: '' },
  space: Number,
  price: Number,
  type: { type: String, default: 'Office' },
  status: { type: String, default: 'Y' },
  remark: { type: String, default: '' }
});

export default mongoose.model('Room', RoomSchema);
