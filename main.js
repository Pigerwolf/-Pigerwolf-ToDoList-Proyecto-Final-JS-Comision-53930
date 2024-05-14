$(document).ready(function() {
    // Obtener elementos del DOM
    const fecha = $('#fecha');
    const lista = $('#lista');
    const input = $('#input');
    const botonAgregar = $('#boton-agregar-tarea');
    const historialLista = $('#historial-lista');
    const botonLimpiarHistorial = $('#eliminar-historial');

    // Definir constantes para los íconos
    const check = 'fa-check-circle';
    const uncheck = 'fa-circle';
    const lineThrough = 'line-through';

    // Listas para almacenar las tareas
    let LISTA_PENDIENTES = [];
    let LISTA_COMPLETADAS = [];

    // Función para mostrar la fecha actual
    function mostrarFecha() {
        const fechaActual = new Date();
        fecha.html(fechaActual.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' }));
    }

    // Función para agregar una tarea a la lista de pendientes
    function agregarTareaPendiente(tarea, id, realizado, fechaCreacion) {
        const realizadoIcono = realizado ? check : uncheck;
        const lineaClase = realizado ? lineThrough : '';

        const elemento = `
            <li data-id="${id}">
                <div class="task-container">
                    <i class="far ${realizadoIcono}" data-realizado="realizado" id="${id}"></i>
                    <p class="text ${lineaClase}">${tarea}</p>
                    <span class="fecha-creacion">Creada el ${fechaCreacion}</span>
                    <i class="fas fa-trash de" data-eliminado="eliminado" id="${id}"></i> 
                </div>
            </li>
        `;

        lista.append(elemento);

        // Mostrar todas las tareas después de agregar una nueva tarea
        $('#lista li').show();
        $('#historial ul').show();
    }

    // Event listener para agregar una tarea al hacer clic en el botón
    botonAgregar.on('click', function() {
        agregarTarea();
    });

    // Event listener para agregar una tarea al presionar la tecla "Enter"
    input.on('keypress', function(event) {
        if (event.which === 13) {
            agregarTarea();
        }
    });

    // Función para agregar una tarea
    function agregarTarea() {
        const tareaTexto = input.val().trim(); // Obtener el texto de la tarea
        if (tareaTexto !== '') {
            const tareaId = Date.now(); // Generar un ID único para la tarea
            const fechaCreacion = new Date().toLocaleDateString(); // Obtener la fecha de creación actual
            agregarTareaPendiente(tareaTexto, tareaId, false, fechaCreacion); // Agregar la tarea a la lista de pendientes
            LISTA_PENDIENTES.push({ nombre: tareaTexto, id: tareaId, realizado: false, fechaCreacion }); // Agregar la tarea a la lista de pendientes en memoria
            guardarEnLocalStorage('PENDIENTES', LISTA_PENDIENTES); // Guardar la lista de pendientes en el almacenamiento local
            input.val(''); // Limpiar el campo de entrada después de agregar la tarea
        }
    }

    // Función para cargar los datos almacenados en el localStorage al iniciar la página
    function cargarDatosLocalStorage() {
        const pendientes = JSON.parse(localStorage.getItem('PENDIENTES')) || [];
        const completadas = JSON.parse(localStorage.getItem('COMPLETADAS')) || [];

        // Cargar historial de tareas completadas
        completadas.forEach(tarea => {
            agregarTareaCompletadaAlHistorial(tarea.nombre, tarea.id);
        });

        // Cargar tareas pendientes
        pendientes.forEach(tarea => {
            agregarTareaPendiente(tarea.nombre, tarea.id, tarea.realizado, tarea.fechaCreacion);
        });

        LISTA_PENDIENTES = pendientes;
        LISTA_COMPLETADAS = completadas;
    }

    // Función para guardar los datos en el localStorage
    function guardarEnLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Función para limpiar el historial de tareas completadas
    function limpiarHistorial() {
        historialLista.html('');
        LISTA_COMPLETADAS = [];
        guardarEnLocalStorage('COMPLETADAS', []);
    }

    // Función para agregar una tarea completada al historial
    function agregarTareaCompletadaAlHistorial(tarea, id) {
        const historialElemento = `
            <li data-id="${id}">
                <span>${tarea}</span>
                <button class="eliminar-historial" data-id="${id}">Eliminar</button>
            </li>`;
        historialLista.append(historialElemento);
    }

    // Event listener para eliminar una tarea completada individualmente del historial
    historialLista.on('click', '.eliminar-historial', function(event) {
        eliminarTareaCompletada($(this));
    });

    // Event listener para gestionar las acciones sobre las tareas (marcar como realizada, eliminar)
    lista.on('click', '.task-container i', function(event) {
        const elementoClicado = $(event.currentTarget);
        if (elementoClicado.data('realizado') === 'realizado') {
            tareaRealizada(elementoClicado);
        } else if (elementoClicado.data('eliminado') === 'eliminado') {
            tareaEliminada(elementoClicado);
        }
    });

    // Event listener para limpiar el historial de tareas completadas
    botonLimpiarHistorial.on('click', function() {
        limpiarHistorial();
    });

    // Event listener para la búsqueda en la lista de pendientes y el historial de tareas completadas
    input.on('input', function() {
        const searchTerm = $(this).val().trim().toLowerCase();
        buscarTareas(searchTerm);
    });

    // Función para realizar la búsqueda y filtrar tanto en la lista de pendientes como en el historial
    function buscarTareas(searchTerm) {
        filtrarPendientes(searchTerm);
        filtrarHistorial(searchTerm);
    }

    // Función para filtrar la búsqueda en la lista de pendientes
    function filtrarPendientes(searchTerm) {
        $('#lista li').each(function() {
            const tareaText = $(this).find('.text').text().toLowerCase();
            if (tareaText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // Función para filtrar la búsqueda en el historial de tareas completadas
    function filtrarHistorial(searchTerm) {
        $('#historial-lista li').each(function() {
            const tareaText = $(this).find('span').text().toLowerCase();
            if (tareaText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // Función para marcar una tarea como realizada
    function tareaRealizada(element) {
        const taskId = parseInt(element.attr('id'));
        const taskIndex = LISTA_PENDIENTES.findIndex(item => item.id === taskId);
        if (taskIndex !== -1) {
            element.toggleClass(check);
            element.toggleClass(uncheck);
            element.parent().find('.text').toggleClass(lineThrough);
            LISTA_PENDIENTES[taskIndex].realizado = !LISTA_PENDIENTES[taskIndex].realizado;
            // Actualizar localStorage
            guardarEnLocalStorage('PENDIENTES', LISTA_PENDIENTES);
            if (LISTA_PENDIENTES[taskIndex].realizado) {
                // Verificar si la tarea ya está en el historial
                const taskInHistory = LISTA_COMPLETADAS.find(item => item.id === taskId);
                if (!taskInHistory) {
                    LISTA_COMPLETADAS.push({
                        nombre: LISTA_PENDIENTES[taskIndex].nombre,
                        id: LISTA_PENDIENTES[taskIndex].id
                    });
                    // Actualizar localStorage
                    guardarEnLocalStorage('COMPLETADAS', LISTA_COMPLETADAS);
                    agregarTareaCompletadaAlHistorial(LISTA_PENDIENTES[taskIndex].nombre, LISTA_PENDIENTES[taskIndex].id);
                }
            } else {
                // Si se desmarca como completada, eliminarla del historial si está presente
                const taskIndexInHistory = LISTA_COMPLETADAS.findIndex(item => item.id === taskId);
                if (taskIndexInHistory !== -1) {
                    LISTA_COMPLETADAS.splice(taskIndexInHistory, 1);
                    $('#historial-lista').find(`[data-id="${taskId}"]`).remove();
                    // Actualizar localStorage
                    guardarEnLocalStorage('COMPLETADAS', LISTA_COMPLETADAS);
                }
            }
        } else {
            console.error('No se encontró la tarea en la lista.');
        }
    }

    // Función para eliminar una tarea de la lista de pendientes
    function tareaEliminada(element) {
        const taskId = parseInt(element.attr('id'));
        const taskIndex = LISTA_PENDIENTES.findIndex(item => item.id === taskId);

        if (taskIndex !== -1) {
            element.parent().parent().remove();
            LISTA_PENDIENTES.splice(taskIndex, 1);

            // Actualizar localStorage
            guardarEnLocalStorage('PENDIENTES', LISTA_PENDIENTES);
        } else {
            console.error('No se encontró la tarea en la lista.');
        }
    }

    // Función para eliminar una tarea completada individualmente del historial
    function eliminarTareaCompletada(element) {
        const taskId = parseInt(element.data('id'));
        const taskIndex = LISTA_COMPLETADAS.findIndex(item => item.id === taskId);

        if (taskIndex !== -1) {
            LISTA_COMPLETADAS.splice(taskIndex, 1);
            element.parent().remove();

            // Actualizar localStorage
            guardarEnLocalStorage('COMPLETADAS', LISTA_COMPLETADAS);
        } else {
            console.error('No se encontró la tarea completada en el historial.');
        }
    }

    // Llamada a la función para mostrar la fecha actual y cargar los datos del localStorage al iniciar la página
    mostrarFecha();
    cargarDatosLocalStorage();
});
