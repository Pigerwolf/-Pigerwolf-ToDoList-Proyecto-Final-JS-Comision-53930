// Seleccionar elementos del DOM
let fecha = document.querySelector('#fecha');
let lista = document.querySelector('#lista');
let input = document.querySelector('#input');
let botonEnter = document.querySelector('#boton-enter');
let historialLista = document.querySelector('#historial-lista');
let botonLimpiarHistorial = document.querySelector('#eliminar-historial');

// Definir constantes para los íconos
let check = 'fa-check-circle';
let uncheck = 'fa-circle';
let lineThrough = 'line-through';

// Listas para almacenar las tareas
let LISTA_PENDIENTES = [];
let LISTA_COMPLETADAS = [];

// Obtener la fecha actual y mostrarla en la página
const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' });

// Función para agregar una nueva tarea a la lista de pendientes
function agregarTareaPendiente(tarea, id, realizado, fechaCreacion) {
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

    LISTA_PENDIENTES.push({
        nombre: tarea,
        id: id,
        realizado: realizado,
        fechaCreacion: fechaCreacion
    });

    // Guardar en el localStorage
    localStorage.setItem('PENDIENTES', JSON.stringify(LISTA_PENDIENTES));
}

// Función para crear una nueva tarea
function crearNuevaTarea() {
    const tarea = input.value;

    if (tarea) {
        const fechaHoraActual = new Date();
        const fechaCreacion = `${fechaHoraActual.toLocaleDateString()} ${fechaHoraActual.toLocaleTimeString()}`;
        agregarTareaPendiente(tarea, LISTA_PENDIENTES.length + 1, false, fechaCreacion);
        input.value = '';
    } else {
        alert("Espacio en blanco...");
    }
}

// Event listeners para agregar una tarea
botonEnter.addEventListener('click', crearNuevaTarea);
document.addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
        crearNuevaTarea();
    }
});

// Función para marcar una tarea como realizada
function tareaRealizada(element) {
    const taskId = parseInt(element.parentNode.parentNode.getAttribute('data-id'));
    const taskIndex = LISTA_PENDIENTES.findIndex(item => item.id === taskId);
    if (taskIndex !== -1) {
        element.classList.toggle(check);
        element.classList.toggle(uncheck);
        element.parentNode.querySelector('.text').classList.toggle(lineThrough);
        LISTA_PENDIENTES[taskIndex].realizado = !LISTA_PENDIENTES[taskIndex].realizado;
        // Actualizar localStorage
        localStorage.setItem('PENDIENTES', JSON.stringify(LISTA_PENDIENTES));
        if (LISTA_PENDIENTES[taskIndex].realizado) {
            // Verificar si la tarea ya está en el historial
            const taskInHistory = LISTA_COMPLETADAS.find(item => item.id === taskId);
            if (!taskInHistory) {
                LISTA_COMPLETADAS.push({
                    nombre: LISTA_PENDIENTES[taskIndex].nombre,
                    id: LISTA_PENDIENTES[taskIndex].id
                });
                // Actualizar localStorage
                localStorage.setItem('COMPLETADAS', JSON.stringify(LISTA_COMPLETADAS));
                agregarTareaCompletadaAlHistorial(LISTA_PENDIENTES[taskIndex].nombre, LISTA_PENDIENTES[taskIndex].id);
            }
        } else {
            // Si se desmarca como completada, eliminarla del historial si está presente
            const taskIndexInHistory = LISTA_COMPLETADAS.findIndex(item => item.id === taskId);
            if (taskIndexInHistory !== -1) {
                LISTA_COMPLETADAS.splice(taskIndexInHistory, 1);
                document.querySelector(`#historial-lista [data-id="${taskId}"]`).remove();
                // Actualizar localStorage
                localStorage.setItem('COMPLETADAS', JSON.stringify(LISTA_COMPLETADAS));
            }
        }
    } else {
        console.error('No se encontró la tarea en la lista.');
    }
}

// Función para eliminar una tarea de la lista de pendientes
function tareaEliminada(element) {
    const taskId = parseInt(element.parentNode.parentNode.getAttribute('data-id'));
    const taskIndex = LISTA_PENDIENTES.findIndex(item => item.id === taskId);

    if (taskIndex !== -1) {
        element.parentNode.parentNode.remove();
        LISTA_PENDIENTES.splice(taskIndex, 1);

        // Actualizar localStorage
        localStorage.setItem('PENDIENTES', JSON.stringify(LISTA_PENDIENTES));
    } else {
        console.error('No se encontró la tarea en la lista.');
    }
}

// Función para agregar una tarea completada al historial
function agregarTareaCompletadaAlHistorial(tarea, id) {
    const historialElemento = `
        <li data-id="${id}">
            <span>${tarea}</span>
            <button class="eliminar-historial" data-id="${id}">Eliminar</button>
        </li>`;
    historialLista.insertAdjacentHTML("beforeend", historialElemento);
}

// Función para limpiar el historial de tareas completadas
function limpiarHistorial() {
    historialLista.innerHTML = '';
    LISTA_COMPLETADAS = [];

    // Actualizar localStorage
    localStorage.setItem('COMPLETADAS', JSON.stringify(LISTA_COMPLETADAS));
}

// Event listener para eliminar una tarea completada individualmente del historial
historialLista.addEventListener('click', function(event) {
    if (event.target.classList.contains('eliminar-historial')) {
        eliminarTareaCompletada(event.target);
    }
});

// Event listener para gestionar las acciones sobre las tareas (marcar como realizada, eliminar)
lista.addEventListener('click', function(event) {
    const elementoClicado = event.target;
    if (elementoClicado.dataset.realizado === 'realizado') {
        tareaRealizada(elementoClicado);
    } else if (elementoClicado.dataset.eliminado === 'eliminado') {
        tareaEliminada(elementoClicado);
    }
});

// Event listener para limpiar el historial de tareas completadas
botonLimpiarHistorial.addEventListener('click', function() {
    limpiarHistorial();
});

// Función para eliminar una tarea completada individualmente del historial
function eliminarTareaCompletada(element) {
    const taskId = parseInt(element.getAttribute('data-id'));
    const taskIndex = LISTA_COMPLETADAS.findIndex(item => item.id === taskId);

    if (taskIndex !== -1) {
        LISTA_COMPLETADAS.splice(taskIndex, 1);
        element.parentNode.remove();

        // Actualizar localStorage
        localStorage.setItem('COMPLETADAS', JSON.stringify(LISTA_COMPLETADAS));
    } else {
        console.error('No se encontró la tarea completada en el historial.');
    }
}

// Función para cargar los datos almacenados en el localStorage al iniciar la página
function cargarDatosLocalStorage() {
    const pendientes = JSON.parse(localStorage.getItem('PENDIENTES')) || [];
    const completadas = JSON.parse(localStorage.getItem('COMPLETADAS')) || [];

    // Cargar historial de tareas completadas
    completadas.forEach(tarea => {
        // Verificar si la tarea ya está en la lista
        const taskInList = LISTA_COMPLETADAS.find(item => item.id === tarea.id);
        if (!taskInList) {
            LISTA_COMPLETADAS.push(tarea);
            agregarTareaCompletadaAlHistorial(tarea.nombre, tarea.id);
        }
    });

    // Cargar tareas pendientes
    pendientes.forEach(tarea => {
        agregarTareaPendiente(tarea.nombre, tarea.id, tarea.realizado, tarea.fechaCreacion);
    });
}

// Llamar a la función para cargar los datos del localStorage al iniciar la página
cargarDatosLocalStorage();
