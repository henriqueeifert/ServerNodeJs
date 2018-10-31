'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        default: 2//getNextSequence('userid')
    },
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
        //unique: true
    },
    senha: {
        type: String,
        required: true
    },
    data_nascimento: {
        type: Date,
        required: false          
    },
    administrador: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('User', schema);