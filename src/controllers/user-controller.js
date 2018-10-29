'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');
const md5 = require('md5');
const dateFormat = require('dateformat');
const authService  = require('../services/auth-service');
const emailService = require('../services/email-service');

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.nome, 3, 'O nome do usuário deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'O e-mail do usuário informado está inválido');
    contract.hasMinLen(req.body.senha, 6, 'A Senha deve conter pelo menos 6 caracteres');
    //
    //console.log(''+req.body.data_nascimento);
    //
    //contract.hasMinLen(req.body.data_nascimento, 10, 'A data de nascimento deve conter pelo menos 10 caracteres');
    //var data_henrique = dateFormat(req.body.data_nascimento, "yyyy-mm-dd h:MM:ss");
    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {   
        await repository.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY),
            administrador: true
        }
        );
        try{
            console.log('email para: '+req.body.email);  
            emailService.send(req.body.email, 
                              'Bem vindo ao e-mail de teste',                              
                              global.EMAIL_TMPL.replace('{0}',req.body.nome));
        
        } catch (e) {
            console.log('Erro envio de e-mail: '+e);
        }

        res.status(200).send({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: 
            {
                nome: req.body.nome,
                email: req.body.email,
                administrador: true,
                data_nascimento: "31/12/2018"
            }            
        });
    } catch (e) {
        //console.log(e);
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição', data: e
        });
    }
};
//
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
            id:            user._id,
            email:         user.email,
            nome:          user.nome,
            administrador: user.administrador
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
            res.status(401).send({
               mensagem: 'Usuário não encontrado'});            
            return;
        }

        const tokenData = await authService.generateToken({
            id:            user._id,
            email:         user.email,
            nome:          user.nome,
            administrador: user.administrador
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

exports.put = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];  
        const data  = await authService.decodeToken(token);
        //
        await repository.update(data.id, 
            {   nome: req.body.nome,
                email: req.body.email,
                senha: md5(req.body.senha + global.SALT_KEY),
                administrador: false});

        res.status(200).send({
            mensagem: 'Usuário atualizado com sucesso!',
            usuario: 
            {
            nome: req.body.nome,
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY),
            administrador: false,
            data_nascimento: "31/12/2018"
        }


        });
    }catch (e){
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.body.email)
        res.status(200).send({
            mensagem: 'Usuário removido com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição'
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        var user = await repository.get();
        res.status(200).send(
            {
                usuario:
                 [
                     user

                ]
                        
        });
    } catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
}