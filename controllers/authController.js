const passport=require('passport');
const Usuarios = require('../models/Usuarios');
const Vacantes = require('../models/Vacantes');
const crypto=require('crypto');
const enviarEmail=require('../handlers/email');

exports.autenticarUsuario=passport.authenticate('local',{
    successRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios'
});
// revisar si esta auth 
exports.verificarUsuario=(req,res,next)=>{
    // usuario
    if(req.isAuthenticated()){
        return next();
    }
    // no auth
    res.redirect('/iniciar-sesion')
}
exports.mostrarPanel=async(req,res)=>{
    // consultar auth
    const vacantes=await Vacantes.find({autor:req.user._id}).lean();
    // console.log(vacantes);
    res.render('administracion',{
        nombrePagina:'Panel de administración',
        tagline:'Crea y Administra tus vacantes desde aquí',
        vacantes,
        cerrarSesion:true,
        nombre:req.user.nombre,
        imagen:req.user.imagen
    })
}
exports.cerrarSesion=(req,res)=>{
    req.logout();
    req.flash('correcto','cerraste sesión correctamente')
    return res.redirect('/iniciar-sesion');
}
exports.formReestablecerPassword=(req,res)=>{
    res.render('reestablecer-password',{
        nombrePagina:'Reestablece tu password',
        tagline:'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    })
}
exports.enviarToken=async(req,res)=>{
    const usuario=await Usuarios.findOne({email:req.body.email});
    if(!usuario){
        req.flash('error','no existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }
    // token
    usuario.token=crypto.randomBytes(20).toString('hex');
    usuario.expira=Date.now()+3600000;

    await usuario.save();
    const resetUrl=`http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    // console.log(resetUrl);

        await enviarEmail.enviar({
            usuario,
            subject:'Password Reset',
            resetUrl,
            archivo:'main'
        })

    req.flash('correcto','Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion')
}

exports.reestablecerPassword=async(req,res,next)=>{
    const usuario=await Usuarios.findOne({
        token:req.params.token,
        expira:{
            $gt:Date.now()
        }
    }).lean()
    if(!usuario){
        req.flash('error','El formulario ya no es válido, intenta de nuevo')
        return res.redirect('/reestablecer-password')
    }

    // ok
    res.render('nuevo-password',{
        nombrePagina:'Nuevo Password',
        nombre:usuario.nombre
    })
}
exports.guardarPassword=async(req,res,next)=>{
    const usuario=await Usuarios.findOne({
        token:req.params.token,
        expira:{
            $gt:Date.now()
        }
    });
    if(!usuario){
        req.flash('error','El formulario ya no es válido, intenta de nuevo')
        return res.redirect('/reestablecer-password')
    }
    // save 
    usuario.password=req.body.password;
    // reset 
    usuario.token=undefined;
    usuario.expira=undefined;
    await usuario.save();
    req.flash('correcto','Password modificado correctamente');
    res.redirect('/iniciar-sesion')
}