'use strict';

var app = require('../..');
import request from 'supertest';

var newBuilding;

describe('Building API:', function() {

  describe('GET /api/buildings', function() {
    var buildings;

    beforeEach(function(done) {
      request(app)
        .get('/api/buildings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          buildings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      buildings.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/buildings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/buildings')
        .send({
          name: 'New Building',
          info: 'This is the brand new building!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBuilding = res.body;
          done();
        });
    });

    it('should respond with the newly created building', function() {
      newBuilding.name.should.equal('New Building');
      newBuilding.info.should.equal('This is the brand new building!!!');
    });

  });

  describe('GET /api/buildings/:id', function() {
    var building;

    beforeEach(function(done) {
      request(app)
        .get('/api/buildings/' + newBuilding._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          building = res.body;
          done();
        });
    });

    afterEach(function() {
      building = {};
    });

    it('should respond with the requested building', function() {
      building.name.should.equal('New Building');
      building.info.should.equal('This is the brand new building!!!');
    });

  });

  describe('PUT /api/buildings/:id', function() {
    var updatedBuilding;

    beforeEach(function(done) {
      request(app)
        .put('/api/buildings/' + newBuilding._id)
        .send({
          name: 'Updated Building',
          info: 'This is the updated building!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBuilding = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBuilding = {};
    });

    it('should respond with the updated building', function() {
      updatedBuilding.name.should.equal('Updated Building');
      updatedBuilding.info.should.equal('This is the updated building!!!');
    });

  });

  describe('DELETE /api/buildings/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/buildings/' + newBuilding._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when building does not exist', function(done) {
      request(app)
        .delete('/api/buildings/' + newBuilding._id)
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
