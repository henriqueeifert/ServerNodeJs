'use strict'

const mongoose = require('mongoose');
const Pergunta     = mongoose.model('Pergunta');

exports.create = async(data) => {
    var pergunta = new Pergunta(data);
    return await pergunta.save();
}
//
exports.get = async() => {
    const res = await Pergunta.find({})
                        .select("id pontuacao texto");
    return await res;
}