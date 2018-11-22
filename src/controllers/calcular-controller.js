'use strict';

const mongoose = require('mongoose');
const repository = require('../repositories/pergunta-repository');

exports.post = async(req, res, next) => {
    var qtPontuacao = 0;
    try {   
        console.log(req.body);         
        for (var i = 0; i < req.body.perguntas.length; i++) {
            //
            const teste = await repository.getById(req.body.perguntas[i]);
            qtPontuacao += teste.pontuacao;
        }    

        res.status(200).send({
            "mensagem": "Resultado Calculado com Sucesso",
              "resultado": {"pontuacao": ""+qtPontuacao+"",
                            "resultado": "teste"+qtPontuacao+"",
                            "descricao": "desc",
                            "data": "2018-11-20"}
        });

    }catch (e) {
        res.status(400).send({
            mensagem: 'Falha ao processar sua requisição (CALCULO): '+e
        });
    }
};
