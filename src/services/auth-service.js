'use strict';
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const repository = require('../repositories/tokens-invalido-repository');

exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}

exports.generateTokenLogout = async (data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: 1 });
}

exports.decodeToken = async (token) => {
    try{
    var data = await jwt.verify(token, global.SALT_KEY);
        }catch (e) {
            return;     
        }      
    return data;
}

exports.authorize =  function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    var tokenInvalido = repository.getByToken(token);
    if (!token) {
        res.status(401).json({
            message: 'Acesso Restrito (Token não informado)'
        });
    } else {        
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(403).json({
                    message: 'Token Inválido'
                });
            } else {          

                /*
                if (tokenInvalido.token){
                    res.status(403).json({
                        message: 'Token Inválido, sessão logout'
                    });
                    return;
                } 
                */       
                next();
            }
        });
    }
};

exports.isAdmin = function (req, res, next) {
    var tokenAuthorization = req.headers['authorization'];
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || tokenAuthorization; 
    const data  = jwt.verify(token, global.SALT_KEY); 

    if (!token) {
        res.status(401).json({
            message: 'Token Inválido (não encontrado)'
        });
    } else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {                                
                if (data.administrador) {
                    next();
                } else {
                    res.status(403).json({
                        message: 'Esta funcionalidade é restrita para administradores'
                    });
                }
            }
        });
    }
};