let fecha = document.querySelector('#fecha');
let lista = document.querySelector('#lista');
let input = document.querySelector('#input');
let botonEnter = document.querySelector('#boton-enter');
let botonLimpiarHistorial = document.querySelector('#eliminar-historial');
let check = 'fa-check-circle';
let uncheck = 'fa-circle';
let lineThrough = 'line-through';
let LIST = [];
let contadorTareasCompletadas = 0;
let LISTA_PENDIENTES = [];
let LISTA_COMPLETADAS = JSON.parse(localStorage.getItem('COMPLETADAS')) || [];
let id = 0;

const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' });

function agregarTarea(tarea, id, realizado, eliminado, fechaCreacion) {
    if (eliminado) { return; }
    const REALIZADO = realizado ? check : uncheck;
    const LINE = realizado ? lineThrough : '';

    const elemento = `
        <li data-id="${id}">
            <div class="task-container">
                <i class="far ${REALIZADO}" data-realizado="realizado" id="${id}"></i>
                <p class="text ${LINE}">${tarea}</p>
                <span class="fecha-creacion">Creada el ${fechaCreacion}</span>
                <i class="fas fa-trash de" data-eliminado="eliminado" id="${id}"></i> 
            </div>
        </li>
    `;

    lista.insertAdjacentHTML("beforeend", elemento);

    LIST.push({
        nombre: tarea,
        id: id,
        realizado: realizado,
        eliminado: eliminado,
        fechaCreacion: fechaCreacion
    });
}

function crearNuevaTarea() {
    const tarea = input.value;

    if (tarea) {
        const fechaHoraActual = new Date();
        const fechaCreacion = `${fechaHoraActual.toLocaleDateString()} ${fechaHoraActual.toLocaleTimeString()}`;
        agregarTarea(tarea, id, false, false, fechaCreacion);
        LISTA_PENDIENTES.push({
            nombre: tarea,
            id: id,
            fechaCreacion: fechaCreacion
        });
        id++;
        input.value = '';
        localStorage.setItem('PENDIENTES', JSON.stringify(LISTA_PENDIENTES));
    } else {
        alert("Por favor ingrese una tarea.");
    }
}

botonEnter.addEventListener('click', crearNuevaTarea);

document.addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
        crearNuevaTarea();
    }
});

function cargarTareasPendientes() {
    const tareasPendientes = JSON.parse(localStorage.getItem('PENDIENTES')) || [];
    tareasPendientes.forEach(tarea => {
        agregarTarea(tarea.nombre, tarea.id, false, false, tarea.fechaCreacion);
    });
}

function cargarTareasCompletadas() {
    LISTA_COMPLETADAS.forEach(tarea => {
        agregarTareaCompletadaAlHistorial(tarea.nombre, tarea.id);
    });
}

function mantenerTareasPendientes() {
    lista.innerHTML = ''; // Limpiar la lista antes de cargar las tareas pendientes
    cargarTareasPendientes();
}

function tareaRealizada(element) {
    const taskId = parseInt(element.parentNode.parentNode.getAttribute('data-id'));
    const taskIndex = LIST.findIndex(item => item.id === taskId);
    if (taskIndex !== -1) {
        element.classList.toggle(check);
        element.classList.toggle(uncheck);
        element.parentNode.querySelector('.text').classList.toggle(lineThrough);
        LIST[taskIndex].realizado = !LIST[taskIndex].realizado;
        if (LIST[taskIndex].realizado) {
            agregarTareaCompletadaAlHistorial(LIST[taskIndex].nombre, LIST[taskIndex].id);
            LISTA_COMPLETADAS.push({
                nombre: LIST[taskIndex].nombre,
                id: LIST[taskIndex].id
            });
            LIST.splice(taskIndex, 1);
            element.parentNode.parentNode.remove();
            localStorage.setItem('PENDIENTES', JSON.stringify(LISTA_PENDIENTES));
            localStorage.setItem('COMPLETADAS', JSON.stringify(LISTA_COMPLETADAS));
        }
    } else {
        console.error('No se encontró la tarea en la lista.');
    }
}

function tareaEliminada(element) {
    const taskId = parseInt(element.parentNode.parentNode.getAttribute('data-id'));
    const taskIndex = LIST.findIndex(item => item.id === taskId);

    if (taskIndex !== -1) {
        element.parentNode.parentNode.remove();
        LIST.splice(taskIndex, 1);
        localStorage.setItem('PENDIENTES', JSON.stringify(LISTA_PENDIENTES));
    } else {
        console.error('No se encontró la tarea en la lista.');
    }
}

function agregarTareaCompletadaAlHistorial(tarea, id) {
    const historialLista = document.querySelector('#historial-lista');
    contadorTareasCompletadas++;
    const historialElemento = `<li data-id="${id}">${contadorTareasCompletadas}. ${tarea}</li>`;
    historialLista.insertAdjacentHTML("beforeend", historialElemento);
}

function limpiarHistorial() {
    const historialLista = document.querySelector('#historial-lista');
    historialLista.innerHTML = '';
    contadorTareasCompletadas = 0;
    LISTA_COMPLETADAS = [];
    localStorage.removeItem('COMPLETADAS');
}

botonLimpiarHistorial.addEventListener('click', limpiarHistorial);

lista.addEventListener('click', function(event) {
    const elementoClicado = event.target;
    if (elementoClicado.dataset.realizado === 'realizado') {
        tareaRealizada(elementoClicado);
    } else if (elementoClicado.dataset.eliminado === 'eliminado') {
        tareaEliminada(elementoClicado);
    }
});

// Llamada a la función para cargar y mostrar solo las tareas pendientes
mantenerTareasPendientes();

// Llamada a la función para cargar las tareas completadas
cargarTareasCompletadas();
