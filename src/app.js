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
const Token    = require('./models/token');
const Resultado = require('./models/resultado');

//carrega rotas
const indexRoute     = require('./routes/index-route');
const userRoute      = require('./routes/user-route');
const perguntaRoute  = require('./routes/pergunta-route');
const gabaritoRoute  = require('./routes/gabarito-route');
const calcularRoute  = require('./routes/calcular-route');
const resultadoRoute  = require('./routes/resultado-route');
const loginRoute     = require('./routes/login-route');

app.use(bodyParser.json({
    limit: '1mb' }));
app.use(bodyParser.urlencoded({ 
    extended: false }));
//
app.use(function(req,res,next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*'/*'X-Requested-With,content-type'*/);
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
    //req.header('Access-Control-Allow-Origin');    
    //res.header();     
    //res.header('Access-Control-Allow-Headers','Content-Type'/*,'x-access-token','X-Requested-With','Accept','Origin','X-Requested-with'*/);
    //req.header('Access-Control-Allow-Methods','GET','POST', 'DELETE','PUT');
    //res.type('application/json');
    //next();
    
})

app.use('/', indexRoute);
app.use('/api/usuario', userRoute);
app.use('/api/pergunta', perguntaRoute);
app.use('/api/gabarito', gabaritoRoute);

app.use('/api/autenticacao', loginRoute);

app.use('/api/questionario/resultados',resultadoRoute);
app.use('/api/questionario/perguntas', perguntaRoute);
app.use('/api/questionario/calcular', calcularRoute);


app.use('/api/resultado',resultadoRoute);


module.exports = app; 