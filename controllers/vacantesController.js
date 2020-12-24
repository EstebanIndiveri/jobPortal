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