const multer = require('multer');
const Usuarios=require('../models/Usuarios');
const shortid=require('shortid');

exports.subirImagen=(req,res,next)=>{
    upload(req,res,function(error){
        if(error){
            if(error instanceof multer.MulterError){
                // return next();
                if(error.code==='LIMIT_FILE_SIZE'){
                    req.flash('error','El archivo es muy grande:Máximo 100kb');
                }else{
                    req.flash('error',error.message);
                }
            }else{
                req.flash('error',error.message); 
            }
            res.redirect('/administracion');
            return;
        }else{
            return next();
        }
        
    });
}
// LIMIT_FILE_SIZE

// config multer
const configuracionMulter={
    limits:{fileSize:100000},
    storage: fileStorage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,__dirname+'../../public/uploads/perfiles');
        },
        filename:(req,file,cb)=>{
            // cb(null,file);
            // console.log(file);
            const extension=file.mimetype.split('/')[1];
            // console.log(`${shortid.generate()}.${extension}`);
            cb(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'||file.mimetype==='image/jpg'){
            // cb true o false
            cb(null,true);
        }else{
            cb(new Error('Formato no válido'),false);
        }
    }
    
}
const upload=multer(configuracionMulter).single('imagen');


exports.formCrearCuenta=(req,res,next)=>{
    res.render('crear-cuenta',{
        nombrePagina:'Crear tu cuenta en devJobos',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
    })
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
    req.checkBody('password','El password no puede estar vacio').notEmpty();
    req.checkBody('confirmar','Confirmar password no puede estar vacio').notEmpty();
    req.checkBody('confirmar','El password es diferente').equals(req.body.password);

    const errores=req.validationErrors();
    if(errores){
        req.flash('error',errores.map(err=>err.msg));
        res.render('crear-cuenta',{
        nombrePagina:'Crear tu cuenta en devJobos',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
        mensajes:req.flash()
        })
        return;
    }
    next();
}

exports.crearUsuario=async(req,res,next)=>{
    const usuario=new Usuarios(req.body);
    const{nombre,email}=req.body;
    try{
        await usuario.save();
        res.redirect('/iniciar-sesion');
    }catch(error){
        req.flash('error',error);
        // res.redirect('/crear-cuenta');
        res.render('crear-cuenta',{
            nombrePagina:'Crear tu cuenta en devJobos',
            tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes:req.flash()
        })
    }
}
exports.formIniciarSesion=(req,res,next)=>{
    res.render('iniciar-sesion',{
        nombrePagina:'Iniciar Sesión devJobs'
    })
}

// form editar perfil
exports.fornmEditarPerfil=(req,res)=>{
    const{nombre,email,imagen}=req.user;
    // console.log(nombre);
    res.render('editar-perfil',{
        nombrePagina:'Editar tu perfil en devJobs',
        nombre,
        cerrarSesion:true,
        email,
        imagen
    })
}
exports.editarPerfil= async(req,res,next)=>{
    const usuario=await Usuarios.findById(req.user._id);
    usuario.nombre=req.body.nombre;
    usuario.email=req.body.email;
    if(req.body.password){
        usuario.pasword=req.body.password;
    }
    if(req.file){
        usuario.imagen=req.file.filename;
    }
    await usuario.save();
    
    req.flash('correcto','Cambios guardados correctamente');

    res.redirect('/administracion'); 
}

exports.validarPerfil=(req,res,next)=>{
    // 
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }
    req.checkBody('nombre','El nombre no puede estar vacio').notEmpty();
    req.checkBody('email','El email no puede estar vacio').notEmpty();

    const errores=req.validationErrors();
    if(errores){
        req.flash('error',errores.map(error=>error.msg))
        res.render('editar-perfil',{
            nombrePagina:'Editar tu perfil en devJobs',
            nombre:req.user.nombre,
            cerrarSesion:true,
            email:req.user.email,
            imagen:req.user.imagen,
            mensajes:req.flash()
        })
    }
    next();
}
