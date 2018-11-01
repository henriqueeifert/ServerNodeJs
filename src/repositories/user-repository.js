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

exports.delete = async(id) => {
    await User.findOneAndRemove(id);
}

exports.authenticate = async(data) => {
    const res = await User.findOne({
        email: data.email,
        senha: data.senha
    });
    return res;
}

exports.getById = async(id) => {
    const  res = await User.findOne({ _id: id});
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
        {
            //active: true
        }, 'nome id email data_nascimento administrador');
    return res;
}