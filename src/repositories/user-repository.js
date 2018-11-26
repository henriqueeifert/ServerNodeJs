'use strict'

const mongoose = require('mongoose');
const User     = mongoose.model('User');

exports.create = async(data) => {
    var user = new User(data);
    return await user.save();
}

exports.getById = async(id) => {
    const resp    = await User.find({});
    var   respStr = JSON.stringify(resp,['id','nome','email','data_nascimento','administrador']);
    return await JSON.parse(respStr);
}

exports.update = async(id, data) => {    
    return await User
        .findByIdAndUpdate(id, data);
}

exports.delete = async(id) => {
    await User.findOneAndRemove({id:id});
}

exports.authenticate = async(data) => {
    const res = await User.findOne({
        email: data.email,
        senha: data.senha
    });
    return res;
}

exports.getByEmail = async(email) => {
    const res = await User
        .findOne({
            email: email,
        }, 'id');
    return res;
}
exports.get = async() => {
    const res = await User.find({}, 'nome _id email data_nascimento administrador');
    return await res;
}