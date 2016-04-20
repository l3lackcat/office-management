'use strict';

var app = require('../..');
import request from 'supertest';

var newBuildingUnit;

describe('BuildingUnit API:', function() {

  describe('GET /api/building-units', function() {
    var buildingUnits;

    beforeEach(function(done) {
      request(app)
        .get('/api/building-units')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          buildingUnits = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      buildingUnits.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/building-units', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/building-units')
        .send({
          name: 'New BuildingUnit',
          info: 'This is the brand new buildingUnit!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBuildingUnit = res.body;
          done();
        });
    });

    it('should respond with the newly created buildingUnit', function() {
      newBuildingUnit.name.should.equal('New BuildingUnit');
      newBuildingUnit.info.should.equal('This is the brand new buildingUnit!!!');
    });

  });

  describe('GET /api/building-units/:id', function() {
    var buildingUnit;

    beforeEach(function(done) {
      request(app)
        .get('/api/building-units/' + newBuildingUnit._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          buildingUnit = res.body;
          done();
        });
    });

    afterEach(function() {
      buildingUnit = {};
    });

    it('should respond with the requested buildingUnit', function() {
      buildingUnit.name.should.equal('New BuildingUnit');
      buildingUnit.info.should.equal('This is the brand new buildingUnit!!!');
    });

  });

  describe('PUT /api/building-units/:id', function() {
    var updatedBuildingUnit;

    beforeEach(function(done) {
      request(app)
        .put('/api/building-units/' + newBuildingUnit._id)
        .send({
          name: 'Updated BuildingUnit',
          info: 'This is the updated buildingUnit!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBuildingUnit = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBuildingUnit = {};
    });

    it('should respond with the updated buildingUnit', function() {
      updatedBuildingUnit.name.should.equal('Updated BuildingUnit');
      updatedBuildingUnit.info.should.equal('This is the updated buildingUnit!!!');
    });

  });

  describe('DELETE /api/building-units/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/building-units/' + newBuildingUnit._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when buildingUnit does not exist', function(done) {
      request(app)
        .delete('/api/building-units/' + newBuildingUnit._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
