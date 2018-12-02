'use strict'

const mongoose = require('mongoose');
const Token = mongoose.model('Token');

exports.create = async(data) => {
    var token = new Token(data);
    return await token.save();
}
exports.getByToken = async(token) => {
    const  res = await Token.findOne({token : token});
    return res;
}