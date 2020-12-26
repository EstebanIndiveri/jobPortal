const Usuarios=require('../models/Usuarios');

exports.formCrearCuenta=(req,res,next)=>{
    res.render('crear-cuenta',{
        nombrePagina:'Crear tu cuenta en devJobos',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}
exports.crearUsuario=async(req,res,next)=>{
    const usuario=new Usuarios(req.body);

    const nuevoUsuario=await usuario.save();
    if(!nuevoUsuario)return next();
    res.redirect('/iniciar-sesion');
}
exports.validarRegistro=(req,res,next)=>{
    // sanitizar campos mutabilidaa
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    // valida
    req.checkBody('nombre','El nombre es obligatorio').notEmpty();
    req.checkBody('email','El email debe ser valido').isEmail();
    req.checkBody('password','El password no puede estar vacio').isEmail();
    req.checkBody('confirmar','Confirmar password no puede estar vacio').isEmail();
    req.checkBody('confirmar','El password es diferente').equals(req.body.password);

    const errores=req.validationErrors();
    if(errores){
        // console.log(errores);
        req.flash('error',errores.map(err=>err.msg));
        res.render('crear-cuenta',{
        nombrePagina:'Crear tu cuenta en devJobos',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
        mensajes:req.flash()
        })
        return;
    }
    next();
    return;
}