'use strict'

const mongoose = require('mongoose');
const Pergunta     = mongoose.model('Pergunta');

exports.create = async(data) => {
    var pergunta = new Pergunta(data);
    return await pergunta.save();
}
//
exports.get = async() => {
    const resp    = await Pergunta.find({});
    var   respStr = JSON.stringify(resp,['id','texto','pontuacao']);
    return await JSON.parse(respStr);
}

exports.pontuacaoById = async(id) => {
    const  res = await Pergunta.findOne({id : id});
    return res;
}

exports.getById = async(id) => {
    const  res = await Pergunta.findOne({id : id});
    return res;
}

exports.update = async(id, data) => {
    return await Pergunta
        .findByIdAndUpdate(id, data);
}

exports.delete = async(id) => {
    await Pergunta.findOneAndRemove(id);
}