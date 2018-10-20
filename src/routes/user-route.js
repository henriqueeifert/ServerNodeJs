'use strict';

const express = require('express');
const router = express.Router();
const controller  = require('../controllers/user-controller');
const authService = require('../services/auth-service');

router.post('/cadastro',controller.post);
router.post('/authenticate', controller.authenticate);
router.post('/refreshToken', authService.authorize, controller.refreshToken);

router.put('/',authService.isAdmin, controller.put);
router.delete('/',authService.isAdmin, controller.delete);
//router.post('/',authService.authorize ,controller.put);

module.exports = router;