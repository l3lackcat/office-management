'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var buildingUnitCtrlStub = {
  index: 'buildingUnitCtrl.index',
  show: 'buildingUnitCtrl.show',
  findByBuildingId: 'buildingUnitCtrl.findByBuildingId',
  create: 'buildingUnitCtrl.create',
  update: 'buildingUnitCtrl.update',
  destroy: 'buildingUnitCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var buildingUnitIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './building-unit.controller': buildingUnitCtrlStub
});

describe('BuildingUnit API Router:', function() {

  it('should return an express router instance', function() {
    buildingUnitIndex.should.equal(routerStub);
  });

  describe('GET /api/building-units', function() {

    it('should route to buildingUnit.controller.index', function() {
      routerStub.get
        .withArgs('/', 'buildingUnitCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/building-units/buildingId/:id', function() {

    it('should route to buildingUnit.controller.findByBuildingId', function() {
      routerStub.get
        .withArgs('/', 'buildingUnitCtrl.findByBuildingId')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/building-units/:id', function() {

    it('should route to buildingUnit.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'buildingUnitCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/building-units', function() {

    it('should route to buildingUnit.controller.create', function() {
      routerStub.post
        .withArgs('/', 'buildingUnitCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/building-units/:id', function() {

    it('should route to buildingUnit.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'buildingUnitCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/building-units/:id', function() {

    it('should route to buildingUnit.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'buildingUnitCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/building-units/:id', function() {

    it('should route to buildingUnit.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'buildingUnitCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
