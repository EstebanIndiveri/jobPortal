const Vacante=require('../models/Vacantes');

exports.formularioNuevaVacante=(req,res,next)=>{
    res.render('nueva-vacante',{
        nombrePagina:'Nueva Vacante',
        tagline:'Llena el formulario y publica tu vacante'
    })
}
exports.agregarVacante=async (req,res,next)=>{
    const vacante=new Vacante(req.body);
    //arreglo de skills
    vacante.skills=req.body.skills.split(','); 
    // save
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
        nombrePagina:`Editar - ${vacante.titulo}`
    })
}