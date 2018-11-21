'use strict'

const mongoose = require('mongoose');
const Pergunta     = mongoose.model('Pergunta');

exports.create = async(data) => {
    var pergunta = new Pergunta(data);
    return await pergunta.save();
}
//
exports.get = async() => {
    const resp = await //Pergunta.find({},null,null,function(err, docs){});

    //Pergunta.find({}, 'pontuacao texto', function (err, docs) { });
    Pergunta.find({});
    //console.log(resp);
    //console.log(JSON.stringify(resp,['id','texto','pontuacao']));
    var respStr = JSON.stringify(resp,['id','texto','pontuacao']);

    return await JSON.parse(respStr);
}