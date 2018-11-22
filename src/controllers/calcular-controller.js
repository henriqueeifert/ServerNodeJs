'use strict';

const mongoose = require('mongoose');
const repository = require('../repositories/pergunta-repository');

exports.post = async(req, res, next) => {
    try {   
        console.log(req.body); 

        var qtPergutas = 0;
        for (var i = 0; i < req.body.perguntas.length; i++) {
            //
            //var data = await repository.pontuacaoById(req.body.perguntas[i]);
            
            //console.log(data);
            /*
            var idPergunta = req.body.perguntas[i];
            if (idPergunta) {
                qtPergutas = qtPergutas + 1;
            }
            console.log(idPergunta);
            */

        }    
        // 
        //console.log(qtPergutas); 

        res.status(200).send({
            "mensagem": "Resultado Calculado com Sucesso",
              "resultado": {"pontuacao": 1,
                            "resultado": "teste",
                            "descricao": "desc",
                            "data": "2018-11-20"}
        });

    }catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição (CALCULO): '+e
        });
    }
};
