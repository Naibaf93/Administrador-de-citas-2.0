// Selectores
let DB;
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando; 

window.onload = () => {
    eventListeners();

    crearDB();
}

// Eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// Clases
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id )
    }

    editarCita(citaActualizada) { 
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo
        if(tipo === 'error'){   
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document. querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta despues de 3 seg
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({citas}) {

        this.limpiarHTML();

        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div')
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `    
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `    
                <span class="font-weight-bolder">Telefono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `    
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `    
                <span class="font-weight-bolder">Propietario: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `    
                <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
            `;

            // Boton para eliminar esta cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>';
            btnEliminar.onclick = () => eliminarCita(id);

            // Añade un boton para editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>'
            btnEditar.onclick = () => cargarEdicion(cita);

            // Agregar los parrafos al div cita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);


            // Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild( contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

// Objeto de cita
const citaObj  = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Funciones
    // Agrega datos al objeto de cita
    function datosCita(e) {
        citaObj[e.target.name] = e.target.value;
    }

    // Valida y agrega una nueva cita a la clase de citas
    function nuevaCita(e) {
        e.preventDefault();

        // Extraer informacion del objeto de citas
        const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

        // Validar
        if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
            ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
            return;
        }

        if(editando) {
            ui.imprimirAlerta('Editado correctamente');

            // Pasar el objeto de la cita editada
            administrarCitas.editarCita({...citaObj});

            // Regresar el texto del boton a su estado original
            formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
            
            // Quitar el modo edicion
            editando = false;
        } else {
            // generar un id unico
            citaObj.id = Date.now();

            // Creando una nueva cita
            administrarCitas.agregarCita({...citaObj});

            // Mensaje de agregado correctamente
            ui.imprimirAlerta('Se agregó correctamente');
        }

        // Reiniciar el objeto para la validacion
        reiniciarObjeto();

        // Reinicia el formulario
        formulario.reset();

        // mostrar el HTML de las citas
        ui.imprimirCitas(administrarCitas);
    }

    function reiniciarObjeto() {
        citaObj.mascota = '';
        citaObj.propietario = '';
        citaObj.telefono = '';
        citaObj.fecha = '';
        citaObj.hora = '';
        citaObj.sintomas = '';
    }

    function eliminarCita(id) {
        // Eliminar la cita
        administrarCitas.eliminarCita(id);

        // Muestra un mensaje
        ui.imprimirAlerta('La cita se eliminó correctamente');

        // Refrescar las citas
        ui.imprimirCitas(administrarCitas);
    }

    // Carga los datos y el modo edicion
    function cargarEdicion(cita) {
        const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
    
        // Llenar los inputs
        mascotaInput.value = mascota;
        propietarioInput.value = propietario;
        telefonoInput.value = telefono;
        fechaInput.value = fecha;
        horaInput.value = hora;
        sintomasInput.value = sintomas;

        // Llenar el objeto
        citaObj.mascota = mascota;
        citaObj.propietario = propietario;
        citaObj.telefono = telefono;
        citaObj.fecha = fecha;
        citaObj.hora = hora;
        citaObj.sintomas = sintomas;
        citaObj.id = id;

       // Cambiar el texto del boton
        formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';
        editando = true;
    }

    function crearDB() {
        // crear la base de datos en version 1.0
        const crearDB = window.indexedDB.open('citas', 1);
        
        // Si hay un error
        crearDB.onerror = function() {
            console.log('hubo un error');
        }

        // Si todo sale bien
        crearDB.onsuccess = function() {
            console.log('DB creada');

            DB = crearDB.result;
            console.log(DB);
        }

        // Definir el schema
        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('citas', {
                keyPath:'id',
                autoIncrement: true
            });

            // Definir columnas
            objectStore.createIndex('mascota', 'mascota', {unique: false});
            objectStore.createIndex('propietario', 'propietario', {unique: false});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('fecha', 'fecha', {unique: false});
            objectStore.createIndex('hora', 'hora', {unique: false});
            objectStore.createIndex('sintomas', 'sintomas', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB creada y lista');
        }
    }    