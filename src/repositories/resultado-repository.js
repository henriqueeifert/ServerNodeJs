'use strict'

const mongoose = require('mongoose');
const Resultado = mongoose.model('Resultado');

exports.create = async(data) => {
    var resultado = new Resultado(data);
    return await resultado.save();
}
//
exports.get = async() => {
    const resp    = await Resultado.find({}).populate('user', 'nome');
    var   respStr = JSON.stringify(resp,['id','resultado','pontuacao', 'descricao', 'data', 'id_usuario', 'nome']);
    return await JSON.parse(respStr);
}
exports.getById = async(id) => {
    const  res = await Resultado.findOne({id : id});
    return res;
}

exports.update = async(id, data) => {
    return await Resultado
        .findByIdAndUpdate(id, data);
}

exports.delete = async(id) => {
    await Resultado.findOneAndRemove({id:id});
}