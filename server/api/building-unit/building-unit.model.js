'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BuildingUnitSchema = new mongoose.Schema({
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  name: { type: String, default: '' },
  floor: { type: String, default: '' },
  size: Number,
  price: Number,
  type: { type: String, default: 'Office' },
  available: { type: Boolean, default: true },
  remark: { type: String, default: '' },
  contact: { type: String, default: '' }
});

export default mongoose.model('BuildingUnit', BuildingUnitSchema);
