'use strict';

const mongoose = require('mongoose');
//const repository = require('../repositories/calcular-repository');

exports.post = async(req, res, next) => {
    try {   
        var qtPergutas = 0;
        for (var i = 0; i < req.body.perguntas.length; i++) {
            var idPergunta = req.body.perguntas[i];
            if (idPergunta) {
                qtPergutas = qtPergutas + 1;
            }
            console.log(idPergunta);
        }    
        //
        console.log(qtPergutas); 
        res.status(200).send({
            mensagem: "Resultado Calculado com Sucesso",
                resultado: {
                    pontuacao: +qtPergutas
                }
        });

    }catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};
