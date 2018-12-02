'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id:         {type: mongoose.Types.ObjectId, required: true},   
    pontuacao:  {type: String,required: true},
    resultado:  {type: String,required: true},
    descricao:  {type: String,required: true},    
    data:       {type: Date,required: true},
    id_usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true} 
});

module.exports = mongoose.model('Resposta', schema);