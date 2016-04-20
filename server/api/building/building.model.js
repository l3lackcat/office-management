'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BuildingSchema = new mongoose.Schema({
  name: String,
  area: { type: String, default: '' },
  trainStation: {
    bts: { type: String, default: '' },
    mrt: { type: String, default: '' }
  }
});

export default mongoose.model('Building', BuildingSchema);
