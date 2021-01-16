const express=require('express');
const router=express.Router();
const homeController=require('../controllers/homeController');
const vacantesController=require('../controllers/vacantesController');
const usuariosController=require('../controllers/usuariosController');
const authController=require('../controllers/authController');




module.exports=()=>{
    router.get('/',homeController.mostrarTrabajos);

    // vacantes
    router.get('/vacantes/nueva',
    authController.verificarUsuario,
    vacantesController.formularioNuevaVacante)
    router.post('/vacantes/nueva',
    authController.verificarUsuario,
    vacantesController.validarVacante,
    vacantesController.agregarVacante);

    // mostrar Vacante
    router.get('/vacantes/:url',vacantesController.mostrarVacante);

    // editar vacante
    router.get('/vacantes/editar/:url',authController.verificarUsuario,vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url',authController.verificarUsuario,vacantesController.validarVacante,vacantesController.editarVacante);

    // Eliminar vacante
    router.delete('/vacantes/eliminar/:id',vacantesController.eliminarVacante)

    // crear user
    router.get('/crear-cuenta',usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',
    usuariosController.validarRegistro,
    usuariosController.crearUsuario);

    // auth
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion',authController.autenticarUsuario)

    // singonut
    router.get('/cerrar-sesion',authController.verificarUsuario,authController.cerrarSesion)

    // administración
    router.get('/administracion',authController.verificarUsuario,authController.mostrarPanel)

    router.get('/editar-perfil',authController.verificarUsuario,usuariosController.fornmEditarPerfil)
    router.post('/editar-perfil',
    authController.verificarUsuario,
    // usuariosController.validarPerfil,
    usuariosController.subirImagen,
    usuariosController.editarPerfil);

    // mensajes de candidatos
    router.post('/vacantes/:url',
    vacantesController.subirCV,
    vacantesController.contactar
    )

    router.get('/candidatos/:id',
    authController.verificarUsuario,
    vacantesController.mostrarCandidatos
    )

    return router;

}