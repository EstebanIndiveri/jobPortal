const { restart } = require('nodemon');
const Vacante=require('../models/Vacantes');

exports.formularioNuevaVacante=(req,res,next)=>{
    res.render('nueva-vacante',{
        nombrePagina:'Nueva Vacante',
        tagline:'Llena el formulario y publica tu vacante',
        cerrarSesion:true,
        nombre:req.user.nombre
    })
}
exports.agregarVacante=async (req,res,next)=>{
    const vacante=new Vacante(req.body);
      // author
      vacante.autor=req.user._id;
    //arreglo de skills
    vacante.skills=req.body.skills.split(','); 
    // savee
    const nuevaVacante= await vacante.save();
    // redirect
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}
exports.mostrarVacante=async(req,res,next)=>{
    const vacante=await Vacante.findOne({url:req.params.url}).lean();

    // sino hay results
    if(!vacante)return next();
    res.render('vacante',{
        vacante,
        nombrePagina:vacante.titulo,
        barra:true
    })
}

exports.formEditarVacante= async(req,res,next)=>{
    const vacante=await Vacante.findOne({url:req.params.url}).lean();
    if(!vacante)return next();
    res.render('editar-vacante',{
        vacante,
        nombrePagina:`Editar - ${vacante.titulo}`,
        cerrarSesion:true,
        nombre:req.user.nombre
    })
}
exports.editarVacante=async(req,res,next)=>{
    const vacanteActualizada=req.body;
  
    vacanteActualizada.skills=req.body.skills.split(',');
    // console.log(vacanteActualizada);
    const vacante=await Vacante.findOneAndUpdate({url:req.params.url},vacanteActualizada,{
        new:true,
        runValidators:true
    });
    res.redirect(`/vacantes/${vacante.url}`);
}

// validar campos vacantes
exports.validarVacante=(req,res,next)=>{
   
    // sanitizar los campos
    req.sanitizeBody('titulo').escape();
    req.sanitizeBody('empresa').escape();
    req.sanitizeBody('ubicacion').escape();
    req.sanitizeBody('salario').escape();
    req.sanitizeBody('contrato').escape();
    req.sanitizeBody('skills').escape();


    // validate 
    req.checkBody('titulo','Agrega un titulo a la vacante').notEmpty();
    req.checkBody('empresa','Agrega una empresa a la vacante').notEmpty();
    req.checkBody('ubicacion','Agrega una ubicación').notEmpty();
    req.checkBody('contrato','Selecciona el tipo de contrato').notEmpty();
    req.checkBody('skills','Agrega al menos una habilidad').notEmpty();

    const errores=req.validationErrors();
    if(errores){
        // reload view
        req.flash('error',errores.map(error=>error.msg))
        res.render('nueva-vacante',{
            nombrePagina:'Nueva Vacante',
            tagline:'Llena el formulario y publica tu vacante',
            cerrarSesion:true,
            nombre:req.user.nombre,
            mensajes:req.flash()
        })
    }
    next();

}

exports.eliminarVacante=async(req,res)=>{
    const{id}=req.params;
    // console.log(id);
    const vacante=await Vacante.findById(id);
    if(verificarAutor(vacante,req.user)){
        // es el user
    vacante.remove();
    res.status(200).send('Vacante Eliminada correctamente');

    }else{
        // no auth
    res.status(403).send('Error');

    }

}

const verificarAutor=(vacante={},usuario={})=>{
 if(!vacante.autor.equals(usuario._id)){
     return false;
 }
 return true;
}