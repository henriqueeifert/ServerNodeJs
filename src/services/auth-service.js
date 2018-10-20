'use strict';
const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, global.SALT_KEY);
    return data;
}

exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

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
                next();
            }
        });
    }
};

exports.isAdmin = function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
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