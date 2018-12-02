'use strict'

const mongoose = require('mongoose');
const Resposta = mongoose.model('Resposta');

exports.create = async(data) => {
    var resposta = new Resposta(data);
    return await resposta.save();
}
//
exports.get = async() => {
    const resp    = await Resposta.find({});
    var   respStr = JSON.stringify(resp,['id','texto','pontuacao']);
    return await JSON.parse(respStr);
}
exports.getById = async(id) => {
    const  res = await Resposta.findOne({id : id});
    return res;
}

exports.update = async(id, data) => {
    return await Resposta
        .findByIdAndUpdate(id, data);
}

exports.delete = async(id) => {
    await Resposta.findOneAndRemove({id:id});
}