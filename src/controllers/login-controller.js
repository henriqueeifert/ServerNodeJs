'use strict';

const moment = require('moment');
const repository = require('../repositories/user-repository');
const md5 = require('md5');
const authService  = require('../services/auth-service');
const mongoose = require('mongoose');

exports.authenticate = async(req, res, next) => {
    try {
        if (!req.body.usuario){
            res.status(400).send({
                mensagem: 'Erro, json deve possuir objeto usuario'
            });            
            return;            
        }        
        if (!req.body.usuario.email || !req.body.usuario.senha){
            res.status(400).send({
                mensagem: 'Favor informar e-mail e senha'});            
            return;
        }
        const user = await repository.authenticate({
            email: req.body.usuario.email,
            senha: md5(req.body.usuario.senha + global.SALT_KEY)
        });
        
        if (!user){
            res.status(400).send({
                mensagem: 'Usuário ou senha inválido'});            
            return;
        }

        const token = await authService.generateToken({
            id:            user.id
        });        
        
        res.status(201).send({
            mensagem: "Login realizado com sucesso",
            usuario:{
                id:    user.id,
                email: user.email,
                nome:  user.nome,
                administrador: user.administrador,
                data_nascimento: moment(user.data_nascimento).format('YYYY-MM-DD'),
                token: token
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

exports.decodeToken = async(req, res, next) => {

    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];  
        if (!token) {
            res.status(400).send({
                mensagem: 'Token deve ser informado: '+token});            
             return;
 
        }
        const data  = await authService.decodeToken(token);

        const user = await repository.getById(data.id);
        
        if (!user){
            res.status(400).send({
               mensagem: 'Usuário não encontrado para o token '+token});            
            return;
        }
        
        res.status(201).send({
            usuario:{
                id:    user.id,
                email: user.email,
                nome:  user.nome,
                administrador: user.administrador,
                data_nascimento: moment(user.data_nascimento).format('YYYY-MM-DD'),
                token: token
            }});
    } catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }    
}    

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

