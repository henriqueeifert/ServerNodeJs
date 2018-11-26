'use strict';
/*
const moment = require('moment');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/user-repository');
const md5 = require('md5');
const dateFormat = require('dateformat');
const authService  = require('../services/auth-service');
const emailService = require('../services/email-service');
*/
exports.post = async(req, res, next) => {
    console.log('POST CHEGOU'); 
    /*

    let contract = new ValidationContract();

    contract.hasMinLen(req.body.nome, 3, 'O nome do usuário deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'O e-mail do usuário informado está inválido');
    contract.hasMinLen(req.body.senha, 6, 'A Senha deve conter pelo menos 6 caracteres');
    contract.isRequired(req.body.nome,'Nome requerido');
    contract.isRequired(req.body.email,'Email requerido');
    contract.isRequired(req.body.senha,'Senha requerido');
    contract.isRequired(req.body.data_nascimento,'Data Nascimento requerido');
    contract.isRequired(req.body.administrador,'Administrador requerido');
    */
    //
    //console.log(''+req.body.data_nascimento);
    //
    //contract.hasMinLen(req.body.data_nascimento, 10, 'A data de nascimento deve conter pelo menos 10 caracteres');
    //var data_henrique = dateFormat(req.body.data_nascimento, "yyyy-mm-dd h:MM:ss");
    // Se os dados forem inválidos
    /*
    if (!contract.isValid()) {
        res.status(400).send({
            mensagem: 'Erro ao incluir o usuário!',
            erros: {
                nome: [
                    'Informações inválidas'
            ]                    
        }});               
        return;
    }
    */
    try {           
        let savedUser = await repository.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY),
            administrador: req.body.administrador,
            data_nascimento: new Date(req.body.data_nascimento),
            id: new mongoose.Types.ObjectId
        });
        
        /*
        try{
            console.log('email para: '+req.body.email);  
            emailService.send(req.body.email, 
                              'Bem vindo ao e-mail de teste',                              
                              global.EMAIL_TMPL.replace('{0}',req.body.nome));
        
        } catch (e) {
            console.log('Erro envio de e-mail: '+e);
        }
*/

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
                //)new Date(savedUser.data_nascimento
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

exports.put = async(req, res, next) => {
    try {
     //   const token = req.body.token || req.query.token || req.headers['x-access-token'];  
     //   const data  = await authService.decodeToken(token);
        //
        var data = await repository.getById(req.params.id);

        if (!data){
            res.status(400).send({
               mensagem: 'Usuário não encontrado'});            
            return;
        }        
        if (req.body.senha){
            const savedUser = await repository.update(req.params.id, 
                {   nome: req.body.nome,
                    email: req.body.email,
                    data_nascimento: new Date(req.body.data_nascimento),
                    senha: md5(req.body.senha + global.SALT_KEY),
                    administrador: req.body.administrador});
        }else
        {
            const savedUser = await repository.update(req.params.id, 
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
                //req.body.data_nascimento
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
                    id: data._id,
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

