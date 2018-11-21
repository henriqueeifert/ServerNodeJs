'use strict';

const mongoose = require('mongoose');
//const repository = require('../repositories/calcular-repository');

exports.post = async(req, res, next) => {
    try {   
        /* */
        next();
    }catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};
