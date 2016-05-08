'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BuildingSchema = new mongoose.Schema({
  name: String,
  location: { type: String, default: '' },
  trainStation: {
    bts: [{ code: String, name: String }],
    mrt: [{ code: String, name: String }]
  },
  specs: {
    built: { type: String, default: '' },
    storeys: { type: String, default: '' },
    ceilingHeight: { type: String, default: '' }
  },
  lifts: {
    passenger: { type: String, default: '' },
    service: { type: String, default: '' },
    parking: { type: String, default: '' }
  },
  lease: {
    leaseTerm: { type: String, default: '' },
    deposit: { type: String, default: '' },
    advanceRental: { type: String, default: '' }
  },
  parking: {
    totalSpaces: { type: String, default: '' },
    tenant: { type: String, default: '' },
    additionalParking: { type: String, default: '' },
    visitorParking: { type: String, default: '' }
  },
  utilities: {
    acType: { type: String, default: '' },
    acCharges: { type: String, default: '' },
    telephone: { type: String, default: '' },
    electricity: { type: String, default: '' },
    waterCharge: { type: String, default: '' }
  }
});

export default mongoose.model('Building', BuildingSchema);
