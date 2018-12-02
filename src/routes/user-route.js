'use strict';

const express = require('express');
const router = express.Router();
const controller  = require('../controllers/user-controller');
const authService = require('../services/auth-service');


router.get('/',       authService.authorize,  controller.get);
router.get('/:id',    authService.authorize,  controller.getById);
router.post('/',      authService.authorize,  controller.post);
router.put('/:id',    authService.isAdmin,    controller.put);
router.delete('/:id', authService.isAdmin,    controller.delete);

module.exports = router;