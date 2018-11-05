'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    texto: {
        type: String,
        required: true
    },
    pontuacao: {
        type: Number,
        required: true
        //unique: true
    }
});

module.exports = mongoose.model('Pergunta', schema);