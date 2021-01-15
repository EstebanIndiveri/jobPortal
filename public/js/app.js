import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded',()=>{
    const skills=document.querySelector('.lista-conocimientos');
    // clear
    let alertas=document.querySelector('.alertas');
    if(alertas){
        limpiarAlertas();
    }

    if(skills){
        skills.addEventListener('click',agregarSkills);
        // en editar llama la funcion
        skillsSeleccionados();
    }
    const vacantesListado=document.querySelector('.panel-administracion');

    if(vacantesListado){
        vacantesListado.addEventListener('click',accionesListado)
    }    
})

const skills=new Set();

const agregarSkills=e=>{
    
    if(e.target.tagName==='LI'){
        if(e.target.classList.contains('activo')){
            // quitar la clase del set
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    const skillsArray=[...skills]
    document.querySelector('#skills').value=skillsArray;
}

const skillsSeleccionados=()=>{
    const seleccionadas =Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    seleccionadas.forEach(seleccionada=>{
        skills.add(seleccionada.textContent)
    })
    const skillsArray=[...skills]
    document.querySelector('#skills').value=skillsArray;
}
const limpiarAlertas=()=>{
    const alertas=document.querySelector('.alertas');
   const interval=setInterval(() => {
    if(alertas.children.length>0){
        alertas.removeChild(alertas.children[0])
    }else if(alertas.children.length===0){
        alertas.parentElement.removeChild(alertas);
        clearInterval(interval);
    }
   }, 2000);
}

// eliminar vacantes
const accionesListado=e=>{
    e.preventDefault();
    // console.log(e.target.dataset.eliminar);
    if(e.target.dataset.eliminar===''|| e.target.dataset.eliminar){        
        // delete
        Swal.fire({
            title: '¿Eliminar la vacante?',
            text: "No se podrá recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText:'No, cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                // peticion
                const url=`${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                // axios
                axios.delete(url,{params:{url}}).then((respuesta)=>{
                    if(respuesta.status===200){
                        
                        Swal.fire(
                            'Deleted!',
                            respuesta.data,
                            'success'
                        );
                        // Eliminar del dom
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                    }
                }).catch(()=>{
                    Swal.fire({
                        type:'error',
                        title:'Hubo un error',
                        text:'No se pudo eliminar'
                    })
                });

            }
          })
    }else if(e.target.href===undefined || e.target.href==='' || e.target.href===null){
        return;
    }else{
        window.location.href=e.target.href;
        console.log(e.target.href)
    }


}