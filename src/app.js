'use strict'

const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const config     = require('./config');
const app        = express();
const router     = express.Router();

//conecta MongoDB 
var conect = mongoose.connect(config.connectionString);


//carrega models
const User     = require('./models/user');
const Pergunta = require('./models/pergunta');
const Gabarito = require('./models/gabarito');

//carrega rotas
const indexRoute = require('./routes/index-route');
const userRoute  = require('./routes/user-route');
const perguntaRoute  = require('./routes/pergunta-route');
const gabaritoRoute  = require('./routes/gabarito-route');

app.use(bodyParser.json({
    limit: '1mb' }));
app.use(bodyParser.urlencoded({ 
    extended: false }));
//
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    //res.type('application/json');
    res.header();
    //res.header('Access-Control-Allow-Headers','Content-Type'/*'*','x-access-token','X-Requested-With','Accept','Origin','X-Requested-with'*/);
    res.header('Access-Control-Allow-Methods','GET','POST', 'DELETE','PUT');
    next();
})

app.use('/', indexRoute);
app.use('/api/usuario', userRoute);
app.use('/api/questionario/perguntas', perguntaRoute);
app.use('/api/questionario/gabaritos', gabaritoRoute);

module.exports = app; 