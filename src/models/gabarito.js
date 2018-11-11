'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    pontuacao: {type: String,required: true},
    resultado: {type: String,required: true},
    descricao: {type: String,required: true},
    id: {type: mongoose.Types.ObjectId}    
});

module.exports = mongoose.model('Gabarito', schema);