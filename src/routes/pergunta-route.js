'use strict';

const express = require('express');
const router = express.Router();
const controller  = require('../controllers/pergunta-controller');
const authService = require('../services/auth-service');

router.get('/',      controller.get);
router.post('/',     authService.isAdmin,   controller.post);
router.get('/:id',   authService.authorize, controller.getById);
router.put('/:id',   authService.isAdmin,   controller.put);
router.delete('/:id',authService.isAdmin,   controller.delete);

module.exports = router;