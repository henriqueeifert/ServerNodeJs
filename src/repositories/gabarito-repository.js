'use strict'

const mongoose = require('mongoose');
const Gabarito     = mongoose.model('Gabarito');

exports.create = async(data) => {
    var gabarito = new Gabarito(data);
    return await gabarito.save();
}
//
exports.get = async() => {
    const res = await Gabarito.find({})
                        .select("id pontuacao descricao resultado");
    return await res;
}