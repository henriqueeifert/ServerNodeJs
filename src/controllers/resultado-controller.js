'use strict';

const mongoose       = require('mongoose');
const repository     = require('../repositories/resultado-repository');
const repositoryUser = require('../repositories/user-repository');
const moment         = require('moment');

exports.post = async(req, res, next) => {
    try {  
        if (req.body.pontuacao < 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Resultado',
                erros: {
                    pontuacao: ['Pontuacao deve ser informada']

                }
            });            
            return;
        }
        if (!req.body.resultado || req.body.resultado.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Resultado',
                erros: {
                    resultado: ['Resultado deve ser informado']
                }
            });            
            return;
        }         
        if (!req.body.descricao || req.body.descricao.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Resultado',
                erros: {
                    descricao: ['Descrição deve ser informada']
                }
            });            
            return;
        }                         
        if (!req.body.id_usuario || req.body.id_usuario.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Resultado',
                erros: {
                    id_usuario: ['Usuário deve ser informado']
                }
            });            
            return;
        }

        let savedPergunta = await repository.create({
            id:         new mongoose.Types.ObjectId,
            pontuacao:  req.body.pontuacao,
            resultado:  req.body.resultado,
            descricao:  req.body.descricao,            
            data:       new Date(req.body.data),
            id_usuario: req.body.id_usuario,
             });

        res.status(200).send({

        mensagem: 'Pergunta cadastrada com sucesso!',
        resultado: 
        {
            id:         savedPergunta.id,
            pontuacao:  savedPergunta.pontuacao,
            resultado:  savedPergunta.resultado,
            descricao:  savedPergunta.descricao,            
            data:       moment(savedPergunta.data).format('YYYY-MM-DD'),
            id_usuario: savedPergunta.id_usuario

        } });
    }catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        var resultado   = await repository.get();   
        /*     
        var resu;
        for (var i = 0; i < resultado.length; i++) {
            const usuario = await repositoryUser.getById(resultado[i].id_usuario);
            var resultCompleto = {
                id:         resultado[i].id,
                resultado:  resultado[i].resultado,
                pontuacao:  resultado[i].pontuacao,
                descricao:  resultado[i].descricao,
                data:       resultado[i].data,  
                id_usuario: resultado[i].id_usuario,
                nome:       usuario.nome  
            };
            if (!resu){
                resu = JSON.stringify(resultCompleto);//resultCompleto;
            }else{
                resu += ','+JSON.stringify(resultCompleto);//resultCompleto;
            }
        }
        console.log('JSON: '+resu);        
        resu = JSON.parse(resu);
        console.log('JSON2: '+resu);        
        */
        res.status(200).send(
            {
                resultados: resultado
            }
        );
    } catch (e) {
        res.status(500).send({
            mensagem: 'Falha ao processar sua requisição: '+e
        });
    }
}


exports.getById = async(req, res, next) => {  
    console.log('TESTE: '+req.params.id);
    var data = await repository.getById(req.params.id);
        
    try {
        res.status(200).send(            
            {
                resultado: {
                    id: data.id,
                    pontuacao:  data.pontuacao,
                    resultado:  data.resultado,
                    descricao:  data.descricao,            
                    data:       moment(data.data).format('YYYY-MM-DD'),
                    id_usuario: data.id_usuario,           
                }
            });
    } catch (e) {
        res.status(400).send({
            mensagem: 'Resultado '+req.params.id+' não encontrado'
        });
    }
}

exports.delete = async(req, res, next) => {
    var data = await repository.getById(req.params.id);
    
    if (!data){
        res.status(400).send({
           mensagem: 'Resultado '+req.params.id+' não encontrado'});            
        return;
    }else{

    try {
        await repository.delete(req.params.id)
        
        res.status(200).send({
            mensagem: 'Resultado removido com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            mensagem: 'Erro ao excluir resultado ID: '+data.id+''+e
            });
        }
    }
};

exports.put = async(req, res, next) => {
    try {
        if (req.body.pontuacao < 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Resultado',
                erros: {
                    pontuacao: ['Pontuacao deve ser informada']
                }
            });            
            return;
        }
        if (!req.body.resultado || req.body.resultado.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Resultado',
                erros: {
                    resultado: ['Resultado deve ser informado']
                }
            });            
            return;
        }         
        if (!req.body.descricao || req.body.descricao.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Resultado',
                erros: {
                    descricao: ['Descrição deve ser informada']
                }
            });            
            return;
        }                         
        if (!req.body.id_usuario || req.body.id_usuario.length <= 0){
            res.status(400).send({
                mensagem: 'Erro ao incluir Resposta',
                erros: {
                    id_usuario: ['Usuário deve ser informado']
                }
            });            
            return;
        }
         
        var data = await repository.getById(req.params.id);
 
        if (!data){
            res.status(400).send({
               mensagem: 'Resultado '+req.params.id+' não encontrado'});            
            return;
        }        
        const savedPergunta = await repository.update(data._id, 
                { 
                    pontuacao:  req.body.pontuacao,
                    resultado:  req.body.resultado,
                    descricao:  req.body.descricao,            
                    data:       new Date(req.body.data),
                    id_usuario: req.body.id_usuario,                    
                });

        res.status(200).send({ 
            mensagem: 'Resultado atualizado com sucesso!',
            resultado: {
                id: savedPergunta.id,
                pontuacao:  savedPergunta.pontuacao,
                resultado:  savedPergunta.resultado,
                descricao:  savedPergunta.descricao,            
                data:       moment(savedPergunta.data).format('YYYY-MM-DD'),
                id_usuario: savedPergunta.id_usuario
            }
        });
    }catch (e){
        res.status(500).send({
            mensagem: 'Erro interno '+e
        });
    }
};
