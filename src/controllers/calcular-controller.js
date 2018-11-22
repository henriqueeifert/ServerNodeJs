'use strict';

const mongoose = require('mongoose');
const prepository = require('../repositories/pergunta-repository');
const grepository = require('../repositories/gabarito-repository');
const moment = require('moment');

exports.post = async(req, res, next) => {
    var qtPontuacao = 0;
    try {   
        console.log(req.body);         
        for (var i = 0; i < req.body.perguntas.length; i++) {
            const perg = await prepository.getById(req.body.perguntas[i]);
            qtPontuacao += perg.pontuacao;
        }    
        const gab = await grepository.getByPontuacao(qtPontuacao);
        var data = new Date();
        
        res.status(200).send({
            "mensagem": "Resultado Calculado com Sucesso",
              "resultado": {"pontuacao": ""+qtPontuacao+"",
                            "resultado": ""+gab.resultado+"",
                            "descricao": ""+gab.descricao+"",
                            "data": ""+moment(data).format('YYYY-MM-DD')+""}
        });

    }catch (e) {
        res.status(400).send({
            mensagem: 'Falha ao processar sua requisição (CALCULO): '+e
        });
    }
};
