'use strict';

const mongoose = require('mongoose');
const repository = require('../repositories/gabarito-repository');

exports.post = async(req, res, next) => {


    try {   
        
        let savedGabarito = await repository.create({
            pontuacao: req.body.pontuacao,
            resultado: req.body.resultado,
            descricao: req.body.descricao,
            id: new mongoose.Types.ObjectId
             });

        res.status(200).send({

        mensagem: 'Gabarito cadastrado com sucesso!',
        gabarito: 
        {
            id: savedGabarito.id,
            pontuacao: req.body.pontuacao,
            resultado: req.body.resultado,
            descricao: req.body.descricao
            
        } });
    }catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        var gabarito = await repository.get();
        
        res.status(200).send(
            {
                gabaritos: gabarito
        }
        );
    } catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
}
