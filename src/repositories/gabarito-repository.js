'use strict'

const mongoose = require('mongoose');
const Gabarito     = mongoose.model('Gabarito');

exports.create = async(data) => {
    var gabarito = new Gabarito(data);
    return await gabarito.save();
}

exports.get = async() => {
    const resp    = await Gabarito.find({});
    var   respStr = JSON.stringify(resp,['id','descricao','pontuacao','resultado']);
    return await JSON.parse(respStr);
}

exports.getById = async(id) => {
    const  res = await Gabarito.findOne({id : id});
    return res;
}

exports.update = async(id, data) => {    
    return await Gabarito
        .findByIdAndUpdate(id, data);
}

exports.delete = async(id) => {
    await Gabarito.findOneAndRemove({id:id});
}

exports.getByPontuacao = async(pont) => {
    const  res = await Gabarito.findOne(
        { pontuacao: { $lte: pont } })
                                    .sort({pontuacao: -1})
                                    .limit(1);
    console.log(res);                                    
    return res;
} 