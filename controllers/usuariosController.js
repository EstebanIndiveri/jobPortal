const Usuarios=require('../models/Usuarios');

exports.formCrearCuenta=(req,res,next)=>{
    res.render('crear-cuenta',{
        nombrePagina:'Crear tu cuenta en devJobos',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}
exports.crearUsuario=async(req,res,next)=>{
    const usuario=new Usuarios(req.body);
    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
        req.flash('error', 'Ese correo ya esta registrado')
    } catch (error) {
        req.flash('error', 'Ese correo ya esta registrado')
        res.redirect('/crear-cuenta');
    }
}
exports.validarRegistro=(req,res,next)=>{
    // sanitizar campos mutabilidaa
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    // req.sanitizeBody('password').escape();
    // req.sanitizeBody('confirmar').escape();
    // console.log(req.body);
    // valida
    req.checkBody('nombre','El nombre es obligatorio').notEmpty();
    req.checkBody('email','El email debe ser valido').isEmail();
    req.checkBody('password','El password no puede estar vacio').notEmpty();
    req.checkBody('confirmar','Confirmar password no puede estar vacio').notEmpty();
    req.checkBody('confirmar','El password es diferente').equals(req.body.password);

    const errores=req.validationErrors();
    // console.log(req.validationErrors());
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