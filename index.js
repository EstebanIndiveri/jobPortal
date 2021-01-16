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
const createError=require('http-errors');
const passport=require('./config/passport');

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
// alertas y flash messages
app.use(flash());
app.use(cookieParser());
app.use(session({
    // cookie:{maxAge:60000},
    secret:process.env.SECRETO,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:true,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}));
// passport
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use((req,res,next)=>{
    res.locals.mensajes=req.flash();
    next();
});
app.use('/',router());

// 404
app.use((req,res,next)=>{
    next(createError(404,'No encontrado'));
})

// admin de errores
app.use((error,req,res)=>{
    res.locals.mensaje=error.message;
    const status=error.status || 500;
    res.locals.status=status;
    res.status(status);
    res.render('error');
})

app.listen(process.env.PUERTO,()=>{
    console.log('Conectado al puerto', process.env.PUERTO)
});
