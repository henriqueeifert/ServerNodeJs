'use strict';

const mongoose = require('mongoose');
const repository = require('../repositories/pergunta-repository');

exports.post = async(req, res, next) => {
    try {  
        if (!req.body.texto || req.body.texto.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Pergunta',
                erros: {
                    texto: ['Texto deve ser informado']

                }
            });            
            return;
        } 
        
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
exports.pontuacaoById = async(req, res, next) => {    
    var data = await repository.pontuacaoById(req.params.id);
        
    try {
        return data.pontuacao;
    } catch (e) {
        res.status(400).send({
            mensagem: 'Pontuacao pergunta '+req.params.id+' não encontrada'
        });
    }
}

exports.getById = async(req, res, next) => {    
    var data = await repository.getById(req.params.id);
        
    try {
        res.status(200).send(            
            {
                pergunta: {
                    id: data.id,
                    pontuacao: data.pontuacao,
                    texto: data.texto                
                }
            });
    } catch (e) {
        res.status(400).send({
            mensagem: 'Pergunta '+req.params.id+' não encontrada'
        });
    }
}

exports.delete = async(req, res, next) => {
    var data = await repository.getById(req.params.id);
    
    if (!data){
        res.status(400).send({
           mensagem: 'Pergunta não encontrada'});            
        return;
    }else{

    try {
        await repository.delete(req.params.id)
        
        res.status(200).send({
            mensagem: 'Pergunta removida com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            mensagem: 'Erro ao excluir Pergunta ID: '+data.id+''+e
            });
        }
    }
};

exports.put = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);

        if (!data){
            res.status(400).send({
               mensagem: 'Pergunta '+req.params.id+' não encontrada'});            
            return;
        }        
        const savedPergunta = await repository.update(data._id, 
                {   pontuacao: req.body.pontuacao,
                    texto: req.body.texto});

        res.status(200).send({
            mensagem: 'Pergunta atualizada com sucesso!',
            pergunta: 
            {
                id: req.params.id,
                pontuacao: req.body.pontuacao,
                texto: req.body.texto
            }
        });
    }catch (e){
        res.status(500).send({
            mensagem: 'Erro interno '+e
        });
    }
};
