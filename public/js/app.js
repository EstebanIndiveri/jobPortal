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
   setInterval(() => {
    if(alertas.children.length>0){
        alertas.removeChild(alertas.children[0])
    }
   }, 2000);
}