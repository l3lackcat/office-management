'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BuildingUnitSchema = new mongoose.Schema({
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  name: { type: String, default: '' },
  floor: { type: String, default: '' },
  space: Number,
  price: Number,
  type: { type: String, default: 'Office' },
  available: { type: Boolean, default: true },
  remark: { type: String, default: '' },
  contactInfo: { type: String, default: '' }
});

export default mongoose.model('BuildingUnit', BuildingUnitSchema);
