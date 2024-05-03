// Selectores

const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

// Clases
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];

        console.log(this.citas);
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
}

const ui = new UI();
const administrarCitas = new Citas();

// Eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

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

        // generar un id unico
        citaObj.id = Date.now();

        // Creando una nueva cita
        administrarCitas.agregarCita({...citaObj});

        // Reiniciar el objeto para la validacion
        reiniciarObjeto();

        // Reinicia el formulario
        formulario.reset();

        // mostrar el HTML de las citas
    }

    function reiniciarObjeto() {
        citaObj.mascota = '';
        citaObj.propietario = '';
        citaObj.telefono = '';
        citaObj.fecha = '';
        citaObj.hora = '';
        citaObj.sintomas = '';
    }