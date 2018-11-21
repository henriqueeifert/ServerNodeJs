'use strict';

const mongoose = require('mongoose');
const repository = require('../repositories/pergunta-repository');

exports.post = async(req, res, next) => {


    try {   
        
        let savedPergunta = await repository.create({
            texto: req.body.texto,
            pontuacao: req.body.pontuacao,
            id: new mongoose.Types.ObjectId
             });

        res.status(200).send({

        mensagem: 'Pergunta cadastrada com sucesso!',
        pergunta: 
        {
            id: savedPergunta.id,
            pontuacao: savedPergunta.pontuacao,
            texto: savedPergunta.texto
        } });
    }catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        var pergunta   = await repository.get();
        res.status(200).send(
            {
                perguntas: pergunta
            }
        );
    } catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
}
