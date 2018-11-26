'use strict';

const express = require('express');
const router = express.Router();
const controller  = require('../controllers/user-controller');
const authService = require('../services/auth-service');

console.log('ROUTE OK');
router.get('/',controller.get);
router.get('/:id',controller.getById);
router.post('/',controller.post);
//router.post('/authenticate', controller.authenticate);
//router.post('/refreshToken', authService.authorize, controller.refreshToken);
router.get('/:id',controller.getById);
router.put('/:id',/*authService.isAdmin,*/ controller.put);
router.delete('/:id',/*,authService.isAdmin,*/ controller.delete);
//router.post('/',authService.authorize ,controller.put);

module.exports = router;