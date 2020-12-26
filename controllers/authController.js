const passport=require('passport');
const Vacantes = require('../models/Vacantes');

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

    res.render('administracion',{
        nombrePagina:'Panel de administración',
        tagline:'Crea y Administra tus vacantes desde aquí',
        vacantes
    })
}