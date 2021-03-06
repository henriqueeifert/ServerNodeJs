'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    texto: {
        type: String,
        required: true
    },
    pontuacao:{
        type: Number,
        required: true,
        default: 1
    },
    id: {
        type: mongoose.Types.ObjectId        
    }    
});




module.exports = mongoose.model('Pergunta', schema);