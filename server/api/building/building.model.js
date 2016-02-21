'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BuildingSchema = new mongoose.Schema({
  name: String,
  contacts: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  address: {
  	buildingName: { type: String, default: '' },
    streetAddress: { type: String, default: '' },
    subDistrict: { type: String, default: '' },
    district: { type: String, default: '' },
    province: { type: String, default: '' },
    postcode: { type: String, default: '' }
  },
  area: { type: String, default: '' },
  remark: { type: String, default: '' }
});

export default mongoose.model('Building', BuildingSchema);
