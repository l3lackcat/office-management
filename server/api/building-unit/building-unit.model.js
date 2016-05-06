'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BuildingUnitSchema = new mongoose.Schema({
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  name: { type: String, default: '' },
  floor: { type: String, default: '' },
  size: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  type: { type: String, default: 'Office' },
  available: { type: Boolean, default: true },
  remark: { type: String, default: '' },
  contact: { type: String, default: '' }
});

export default mongoose.model('BuildingUnit', BuildingUnitSchema);
