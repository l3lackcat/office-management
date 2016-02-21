'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var buildingCtrlStub = {
  index: 'buildingCtrl.index',
  show: 'buildingCtrl.show',
  create: 'buildingCtrl.create',
  update: 'buildingCtrl.update',
  destroy: 'buildingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var buildingIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './building.controller': buildingCtrlStub
});

describe('Building API Router:', function() {

  it('should return an express router instance', function() {
    buildingIndex.should.equal(routerStub);
  });

  describe('GET /api/buildings', function() {

    it('should route to building.controller.index', function() {
      routerStub.get
        .withArgs('/', 'buildingCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/buildings/:id', function() {

    it('should route to building.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'buildingCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/buildings', function() {

    it('should route to building.controller.create', function() {
      routerStub.post
        .withArgs('/', 'buildingCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/buildings/:id', function() {

    it('should route to building.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'buildingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/buildings/:id', function() {

    it('should route to building.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'buildingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/buildings/:id', function() {

    it('should route to building.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'buildingCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
