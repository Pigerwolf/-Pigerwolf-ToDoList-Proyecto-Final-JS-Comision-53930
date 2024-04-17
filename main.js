let fecha = document.querySelector('#fecha')
let lista = document.querySelector('#lista')
let elemento = document.querySelector('#elemento')
let input = document.querySelector('#input')
let botonEnter = document.querySelector('#boton-enter')
let check = 'fa-check-circle'
let uncheck = 'fa-circle'
let lineThrough = 'line-through'
let LIST
let contadorTareasCompletadas = 0;

let id // para que inicie en 0 cada tarea tendra un id diferente
       //creacion de fecha actualizada 
const FECHA = new Date ()
fecha.innerHTML = FECHA.toLocaleDateString('es-MX',{weekday: 'long', month: 'short', day:'numeric'})
    // funcion de agregar tarea 
function agregarTarea( tarea,id,realizado,eliminado) {
    if(eliminado) {return} 
    // si existe eliminado es true si no es false 
    const REALIZADO = realizado ? check : uncheck 
    // si realizado es verdadero check si no uncheck
    const LINE = realizado ? lineThrough : '' 
    const elemento = `
                        <li id="elemento">
                        <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
                        <p class="text ${LINE}">${tarea}</p>
                        <i class="fas fa-trash de" data="eliminado" id="${id}"></i> 
                        </li>
                    `
    lista.insertAdjacentHTML("beforeend",elemento)
}
    // funcion de Tarea Realizada 
function tareaRealizada(element) {
    element.classList.toggle(check)
    element.classList.toggle(uncheck)
    element.parentNode.querySelector('.text').classList.toggle(lineThrough)
    LIST[element.id].realizado = LIST[element.id].realizado ?false :true 
    //Si
    // console.log(LIST)
    // console.log(LIST[element.id])
    // console.log(LIST[element.id].realizado)
}
function tareaEliminada(element){
    // console.log(element.parentNode)
    // console.log(element.parentNode.parentNode)
    element.parentNode.parentNode.removeChild(element.parentNode)
    LIST[element.id].eliminado = true
    console.log(LIST)
}
// crear un evento para escuchar el enter y para habilitar el boton 
botonEnter.addEventListener('click', ()=> {
    const tarea = input.value
    if(tarea){
        agregarTarea(tarea,id,false,false)
        LIST.push({
            nombre : tarea,
            id : id,
            realizado : false,
            eliminado : false
        })
        localStorage.setItem('TODO',JSON.stringify(LIST))
        id++
        input.value = ''
    }
})
// Funcion agregar tarea nueva
document.addEventListener('keyup', function (event) {
    if (event.key=='Enter'){
        const tarea = input.value
        if(tarea) {
            agregarTarea(tarea,id,false,false)
        LIST.push({
            nombre : tarea,
            id : id,
            realizado : false,
            eliminado : false
        })
        localStorage.setItem('TODO',JSON.stringify(LIST))
     
        input.value = ''
        id++
        console.log(LIST)
        }
    }
})
// Funcion eliminar Tareas
lista.addEventListener('click',function(event){
    const element = event.target 
    const elementData = element.attributes.data.value
    console.log(elementData)
    
    if(elementData == 'realizado') {
        tareaRealizada(element)
    }
    else if(elementData == 'eliminado') {
        tareaEliminada(element)
        console.log("elimnado")
    }
    localStorage.setItem('TODO',JSON.stringify(LIST))
})
// Función para agregar tarea completada al historial
function agregarTareaCompletadaAlHistorial(tarea, id) {
    const historialLista = document.querySelector('#historial-lista');
    // Verificar si la tarea ya existe en el historial
    const existe = document.querySelector(`#historial-lista li[data-id="${id}"]`);
    if (!existe) {
        contadorTareasCompletadas++; // Incrementar el contador
        const historialElemento = `<li data-id="${id}">${contadorTareasCompletadas}. ${tarea}</li>`;
        historialLista.insertAdjacentHTML("beforeend", historialElemento);
    }
}
// Función para reenumerar las tareas en el historial
function reenumerarTareasEnHistorial() {
    const tareasEnHistorial = document.querySelectorAll('#historial-lista li');
    let nuevoContador = 0;
    tareasEnHistorial.forEach((tarea) => {
        nuevoContador++;
        tarea.textContent = `${nuevoContador}. ${tarea.textContent.slice(tarea.textContent.indexOf(' ') + 1)}`;
    });
    contadorTareasCompletadas = nuevoContador;
}
// Modifica la función tareaRealizada para manejar la eliminación de tareas del historial
function tareaRealizada(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough);
    const tarea = LIST[element.id];
    tarea.realizado = !tarea.realizado;
    // Si la tarea se desmarca como completada, eliminarla del historial si existe
    if (!tarea.realizado) {
        const tareaEnHistorial = document.querySelector(`#historial-lista li[data-id="${tarea.id}"]`);
        if (tareaEnHistorial) {
            tareaEnHistorial.remove();
            reenumerarTareasEnHistorial(); // Reenumerar las tareas restantes en el historial
        }
    }
    // Agrega la tarea completada al historial con su id único
    if (tarea.realizado) {
        agregarTareaCompletadaAlHistorial(tarea.nombre, tarea.id);
    }

    localStorage.setItem('TODO', JSON.stringify(LIST));
}
// Cuando cargas la lista, también agrega las tareas completadas al historial
function cargarLista(array) {
    array.forEach(function(item) {
        agregarTarea(item.nombre, item.id, item.realizado, item.eliminado);
        if (item.realizado) {
            agregarTareaCompletadaAlHistorial(item.nombre);
        }
    });
}
// Obtener una referencia al botón de eliminar historial
const botonEliminarHistorial = document.querySelector('#eliminar-historial');
botonEliminarHistorial.addEventListener('click', function() {
    const historialLista = document.querySelector('#historial-lista');
    historialLista.innerHTML = '';
    contadorTareasCompletadas = 0;
    // También puede ser borrar el historial del almacenamiento local si lo deseas
    // localStorage.removeItem('TODO');
});
let data = localStorage.getItem('TODO')
if(data){
    LIST = JSON.parse(data)
    console.log(LIST)
    id = LIST.length
    cargarLista(LIST)
}else {
    LIST = []
    id = 0
}
function cargarLista(array) {
    array.forEach(function(item){
        agregarTarea(item.nombre,item.id,item.realizado,item.eliminado)
    })
}

/* JS del LOGIN */

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

/* END */




















