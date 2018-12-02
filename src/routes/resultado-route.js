'use strict';

const express = require('express');
const router = express.Router();
const controller  = require('../controllers/resultado-controller');
const authService = require('../services/auth-service');

router.post('/',      authService.authorize, controller.post);
router.get('/',       authService.authorize, controller.get);
router.get('/:id',    authService.authorize, controller.getById);
router.put('/:id',    authService.isAdmin,   controller.put);
router.delete('/:id', authService.isAdmin,   controller.delete);

module.exports = router;