'use strict';

const moment = require('moment');
const repository = require('../repositories/user-repository');
const md5 = require('md5');
const authService  = require('../services/auth-service');
const mongoose = require('mongoose');

exports.authenticate = async(req, res, next) => {
    try { 
        const user = await repository.authenticate({
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY)
        });
        
        if (!user){
            res.status(404).send({
                mensagem: 'Usuário ou senha inválidos'});            
            return;
        }

        const token = await authService.generateToken({
            id:            user.id
            //email:         user.email,
            //nome:          user.nome,
            //administrador: user.administrador
        });        
        
        res.status(201).send({
            token: token,
            data:{
                email: user.email,
                nome:  user.nome
            }
        });
    } catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};

exports.refreshToken = async(req, res, next) => {
    try {   

        const token = req.body.token || req.query.token || req.headers['x-access-token'];  
        const data  = await authService.decodeToken(token);

        const user = await repository.getById(data.id);
        
        if (!user){
            res.status(400).send({
               mensagem: 'Usuário não encontrado'});            
            return;
        }

        const tokenData = await authService.generateToken({
            id:            user.id
            //email:         user.email,
            //nome:          user.nome,
            //administrador: user.administrador
        });        
        
        res.status(201).send({
            token: tokenData,
            data:{
                email: user.email,
                nome:  user.nome
            }
        });
    } catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        var user = await repository.get();
        
        res.status(200).send(
            {
                usuarios: user                        
        });
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
                usuario:                 
                {
                    id: data.id,
                    nome: data.nome,
                    email: data.email,
                    data_nascimento: moment(data.data_nascimento).format('YYYY-MM-DD'),
                    administrador: data.administrador
                }
            }
            );
    } catch (e) {
        res.status(400).send({
            mensagem: 'Usuário não encontrado'
        });
    }
}

