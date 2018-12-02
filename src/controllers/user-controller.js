'use strict';

const moment = require('moment');
//const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');
const md5 = require('md5');
//const dateFormat = require('dateformat');
const authService  = require('../services/auth-service');
//const emailService = require('../services/email-service');
const mongoose = require('mongoose');

exports.post = async(req, res, next) => {
    if (!req.body.nome || req.body.nome.length <= 3){
        res.status(400).send({
            mensagem: 'Erro ao incluir User',
            erros: {
                nome: ['Nome deve ser informado ou possuir mais de 3 caracteres']
            }
        });            
        return;
    }         
    if (!req.body.senha || req.body.senha.length <= 5){
        res.status(400).send({
            mensagem: 'Erro ao incluir user',
            erros: {
                senha: ['Senha deve ser informada ou possuir mais de 5 caracteres']
            }
        });            
        return;
    }                         
    if (!req.body.email || req.body.email.length <= 0){

        res.status(400).send({
            mensagem: 'Erro ao incluir User',
            erros: {
                id_usuario: ['E-mail deve ser informado']
            }
        });            
        return;
    }
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);

    if (!reg.test(req.body.email)){
    res.status(400).send({
        mensagem: 'Erro ao incluir User',
        erros: {
            email: ['E-mail deve possuir formato válido']
        }
    });            
      return;
    }
    if (!req.body.data_nascimento || req.body.data_nascimento.length < 10){

        res.status(400).send({
            mensagem: 'Erro ao incluir User',
            erros: {
                data_nascimento: ['Data de nascimento deve ser informada']
            }
        });            
        return;
    }

    try {           
        let savedUser = await repository.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY),
            administrador: req.body.administrador,
            data_nascimento: new Date(req.body.data_nascimento),
            id: new mongoose.Types.ObjectId
        });
        
        let dateStr = moment(savedUser.data_nascimento).format('YYYY-MM-DD');
        res.status(200).send({

            mensagem: 'Usuário cadastrado com sucesso!',          
            usuario: 
            {
                id: savedUser.id,
                nome: savedUser.nome,
                email: savedUser.email,
                administrador: savedUser.administrador,
                data_nascimento:  dateStr
            }            
        });
    } catch (e) {
        console.log('Erro'+e);
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
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
            id:            user.id
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

        const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'].substr(7);  
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

exports.put = async(req, res, next) => {
    try {

        if (!req.body.nome || req.body.nome.length <= 3){
            res.status(400).send({
                mensagem: 'Erro ao incluir User',
                erros: {
                    nome: ['Nome deve ser informado ou possuir mais de 3 caracteres']
                }
            });            
            return;
        }         
        if (!req.body.senha || req.body.senha.length <= 5){
            res.status(400).send({
                mensagem: 'Erro ao incluir user',
                erros: {
                    senha: ['Senha deve ser informada ou possuir mais de 5 caracteres']
                }
            });            
            return;
        }                         
        if (!req.body.email || req.body.email.length <= 0){
    
            res.status(400).send({
                mensagem: 'Erro ao incluir User',
                erros: {
                    id_usuario: ['E-mail deve ser informado']
                }
            });            
            return;
        }
        var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    
        if (!reg.test(req.body.email)){
        res.status(400).send({
            mensagem: 'Erro ao incluir User',
            erros: {
                email: ['E-mail deve possuir formato válido']
            }
        });            
          return;
        }
        if (!req.body.data_nascimento || req.body.data_nascimento.length < 10){
    
            res.status(400).send({
                mensagem: 'Erro ao incluir User',
                erros: {
                    data_nascimento: ['Data de nascimento deve ser informada']
                }
            });            
            return;
        }
        var data = await repository.getById(req.params.id);
        console.log('ID: '+req.params.id+' _ID: '+data._id+' email: '+data.email);
        console.log(data);

        if (!data){
            res.status(400).send({
               mensagem: 'Usuário não encontrado'});            
            return;
        }        
        if (req.body.senha){
            const savedUser = await repository.update(data._id, 
                {   nome: req.body.nome,
                    email: req.body.email,
                    data_nascimento: new Date(req.body.data_nascimento),
                    senha: md5(req.body.senha + global.SALT_KEY),
                    administrador: req.body.administrador});
        }else 
        {
            const savedUser = await repository.update(data._id, 
                {   nome: req.body.nome,
                    email: req.body.email,  
                    data_nascimento: new Date(req.body.data_nascimento),                  
                    administrador: req.body.administrador});                
        }
        res.status(200).send({
            mensagem: 'Usuário atualizado com sucesso!',
            usuario: 
            {
                id: req.params.id,
                nome: req.body.nome,
                email: req.body.email,
                administrador: req.body.administrador,
                data_nascimento: moment(req.body.data_nascimento).format('YYYY-MM-DD')
        }
        });
    }catch (e){
        res.status(500).send({
            mensagem: 'Erro interno '+e
        });
    }
};

exports.delete = async(req, res, next) => {
        var data = await repository.getById(req.params.id);
        
        if (!data){
            res.status(400).send({
               mensagem: 'Usuário não encontrado'});            
            return;
        }else{

    try {
        await repository.delete(req.params.id)

        
        res.status(200).send({
            mensagem: 'Usuário removido com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            mensagem: 'Erro ao excluir usuário ID: '+data.id+''+e
        });
    }
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

