'use strict'

const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const config     = require('./config');
const app = express();
const router = express.Router();

//conecta MongoDB 
mongoose.connect(config.connectionString);
//carrega models
const Customer  = require('./models/user');

//carrega rotas
const indexRoute = require('./routes/index-route');
const userRoute  = require('./routes/user-route');

app.use(bodyParser.json({
    limit: '1mb' }));
app.use(bodyParser.urlencoded({
    extended: false }));
//
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Content-Type','x-access-token','Accept','Origin','X-Requested-with');
    res.header('Access-Control-Allow-Methods','GET','POST', 'DELETE','PUT');
    next();
})

app.use('/', indexRoute);
app.use('/api/autenticacao', userRoute);

module.exports = app; 