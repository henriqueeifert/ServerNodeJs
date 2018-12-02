'use strict';

const express = require('express');
const router = express.Router();
const controller  = require('../controllers/login-controller');
const controllerUser  = require('../controllers/user-controller');
const authService = require('../services/auth-service');

router.post('/login', controller.authenticate);
router.post('/cadastrar',controllerUser.post);
router.get('/usuario',controller.decodeToken);
router.put('/usuario',controllerUser.put);
router.get('/logout',controller.get);

module.exports = router;