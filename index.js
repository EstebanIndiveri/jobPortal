const mongoose=require('mongoose');
require('./config/db');
require('dotenv').config({path:'variables.env'});
const express=require('express');
const router=require('./routes');
const exphbs=require('express-handlebars');
const path=require('path');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const bodyparser=require('body-parser');
const expressValidator=require('express-validator');
const flash=require('connect-flash');

const app = express();
// bodyparser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressValidator());
// habilita handlebars como template engime
app.engine('handlebars',
    exphbs({
        defaultLayout:'layout',
        helpers:require('./helpers/handlebars')
    })
);
app.set('view engine','handlebars');
// static
app.use(express.static(path.join(__dirname,'/public')));
app.use(cookieParser());
app.use(session({
    secret:process.env.SECRETO,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}));
// alertas y flash messages
app.use(flash());
// middleware
app.use((req,res,next)=>{
    res.locals.mesajes=req.flash();
    next();
});
app.use('/',router());

app.listen(process.env.PUERTO,()=>{
    console.log('Conectado al puerto', process.env.PUERTO)
});
