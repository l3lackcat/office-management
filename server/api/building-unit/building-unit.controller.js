/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/building-units              ->  index
 * POST    /api/building-units              ->  create
 * GET     /api/building-units/:id          ->  show
 * PUT     /api/building-units/:id          ->  update
 * DELETE  /api/building-units/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import BuildingUnit from './building-unit.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of BuildingUnits
export function index(req, res) {
  BuildingUnit.find()
    .populate('building')
    .execAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single BuildingUnit from the DB
export function show(req, res) {
  BuildingUnit.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of BuildingUnits by buildingId
export function findByBuildingId(req, res) {
  BuildingUnit.find({ building: req.params.id })
    .populate('building')
    .execAsync()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new BuildingUnit in the DB
export function create(req, res) {
  BuildingUnit.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing BuildingUnit in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  BuildingUnit.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a BuildingUnit from the DB
export function destroy(req, res) {
  BuildingUnit.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
