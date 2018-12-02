'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    token: {type: String,required: true}
});

module.exports = mongoose.model('Token', schema);