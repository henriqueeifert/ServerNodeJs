'use strict'

const mongoose = require('mongoose');
const User     = mongoose.model('User');

exports.create = async(data) => {
    var user = new User(data);
    await user.save();
}

exports.update = async(id, data) => {
    await User
        .findByIdAndUpdate(id, data);
}

exports.delete = async(email) => {
    await User
        .findOneAndRemove(email);
}

exports.authenticate = async(data) => {
    const res = await User.findOne({
        email: data.email,
        senha: data.senha
    });
    return res;
}

exports.getById = async(id) => {
    const  res = await User.findById(id);
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
    const res = await User.find(
        { "usuario": 
        {
            id: _id,
            email: email,
            nome: nome,
            data_nascimento: "31/12/2018",
            administrador: administrador

        //active: true
    }}/*, '_id nome email data_nascimento administrador'*/);
    return res;
}