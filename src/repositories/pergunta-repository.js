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
    var res = await Pergunta.find({id : id});
    return await res.pontuacao;
}

exports.pontuacao2ById = async(id) => {
    console.log('id pontuacaoById: '+id);
    try{
    var res = await Pergunta.find({id : id});

    if (!res){
        console.log('invalid');
    }
        return await res;

    }catch (e) {
        res.status(400).send({
            mensagem: 'Pergunta '+id+' não encontrada'});            
         return; 
    }    
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
    await Pergunta.findOneAndRemove({id:id});
}