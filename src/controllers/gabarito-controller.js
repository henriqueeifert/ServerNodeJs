'use strict';

const mongoose = require('mongoose');
const repository = require('../repositories/gabarito-repository');

exports.post = async(req, res, next) => {
    try {   
        if (!req.body.resultado || req.body.resultado.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Gabarito',
                erros: {
                    resultado: ['Resultado deve ser informado']

                }
            });            
            return;
        } 
        if (!req.body.descricao || req.body.descricao.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Gabarito',
                erros: {
                    descricao: ['Descrição deve ser informada']

                }
            });            
            return;
        }         
        
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
            pontuacao: savedGabarito.pontuacao,
            resultado: savedGabarito.resultado,
            descricao: savedGabarito.descricao
            
        } });
    }catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        var gabarito   = await repository.get();
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

exports.getById = async(req, res, next) => {    
    var data = await repository.getById(req.params.id);
        
    try {
        res.status(200).send(            
            {
                gabarito: {
                    id: data.id,
                    pontuacao: data.pontuacao,
                    resultado: data.resultado,
                    descricao: data.descricao             
                }
            });
    } catch (e) {
        res.status(400).send({
            mensagem: 'Gabarito '+req.params.id+' não encontrado'
        });
    }
}

exports.delete = async(req, res, next) => {
    var data = await repository.getById(req.params.id);
    
    if (!data){
        res.status(400).send({
           mensagem: 'Gabarito não encontrado'});            
        return;
    }else{

    try {
        await repository.delete(req.params.id)
        
        res.status(200).send({
            mensagem: 'Gabarito removido com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            mensagem: 'Erro ao excluir Gabarito ID: '+data.id+''+e
            });
        }
    }
};

exports.put = async(req, res, next) => {
    try {
        if (!req.body.resultado || req.body.resultado.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao alterar Gabarito',
                erros: {
                    resultado: ['Resultado deve ser informado']

                }
            });            
            return;
        } 
        if (!req.body.descricao || req.body.descricao.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao alterar Gabarito',
                erros: {
                    descricao: ['Descrição deve ser informada']

                }
            });            
            return;
        } 

        var data = await repository.getById(req.params.id);

        if (!data){
            res.status(400).send({
               mensagem: 'Gabarito '+req.params.id+' não encontrado'});            
            return;
        }        
        const savedGabarito = await repository.update(data._id, 
                {   pontuacao: req.body.pontuacao,
                    resultado: req.body.resultado,
                    descricao: req.body.descricao}                    
                );

        res.status(200).send({
            mensagem: 'Gabarito atualizado com sucesso!',
            pergunta: 
            {
                id: req.params.id,
                pontuacao: req.body.pontuacao,
                resultado: req.body.resultado,
                descricao: req.body.descricao
            }
        });
    }catch (e){
        res.status(500).send({
            mensagem: 'Erro interno '+e
        });
    }
};