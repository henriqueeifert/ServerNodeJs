'use strict';

const mongoose = require('mongoose');
const repository = require('../repositories/pergunta-repository');

exports.post = async(req, res, next) => {
    try {   
        console.log(req.body);
        if (req.body != 'perguntas'){
            console.log('ERRO');
            res.status(400).send({
                mensagem: 'JSON inválido: '+req.body
            });            
        }
    
        var qtPergutas = 0;
        for (var i = 0; i < req.body.perguntas.length; i++) {
            //
            var data = await repository.pontuacaoById(req.body.perguntas[i]);
            //
            console.log('vale: '+data);
            /*
            var idPergunta = req.body.perguntas[i];
            if (idPergunta) {
                qtPergutas = qtPergutas + 1;
            }
            console.log(idPergunta);
            */

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