let pagina = 1;

const cita = {
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarServicios();
  //resalta el div actual
  mostrarSeccion();
  //oculta una seccion segun el tab que se presiona
  cambiarSeccion();
  //paginacion siguiente y anterior
  paginaSiguiente();
  paginaAnterior();

  //comprueba la pagina actual para ocultar la paginacion
  botonesPaginador();
  //muestra el resumen de la cita o error en caso no pasar la validacion
  mostrarResumen();

  //Almacena el nombre de la cita
  nombreCita();

  //almacenar la fecha de cita
  fechaCita();
  //deshabilitar dias pasado
  deshabilitarFecha();
  //almacena la hora
  horaCita();
}

function mostrarSeccion() {
  //eliminar mostrar-seccion  de la seccion anterior
  const seccionAnterior = document.querySelector(".mostrar-seccion");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar-seccion");
  }

  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add("mostrar-seccion");

  //eliminar la clase actual en el anterior
  const tabAnterior = document.querySelector(".tabs .actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  //resalta el tab actual
  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add("actual");
}

function cambiarSeccion() {
  const enlaces = document.querySelectorAll(".tabs button");

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      pagina = parseInt(e.target.dataset.paso);

      // llamar la funcion de mostrar seccion
      mostrarSeccion();
      botonesPaginador();
    });
  });
}

async function mostrarServicios() {
  try {
    const resultado = await fetch("./servicios.json");
    const db = await resultado.json();

    const { servicios } = db;
    //generar html
    servicios.forEach((servicio) => {
      const { id, nombre, precio } = servicio;

      //DOM scripting
      //Generar nombre de servicio
      const nombreServicio = document.createElement("P");
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add("nombre-servicio");

      //Generar precio de servicios
      const precioServicio = document.createElement("P");
      precioServicio.textContent = `$ ${precio}`;
      precioServicio.classList.add("precio-servicio");

      //generar div contenedor de servicio

      const servicioDiv = document.createElement("DIV");
      servicioDiv.classList.add("servicio");
      servicioDiv.dataset.idServicio = id;

      //Selecciona un servicio para la cita
      servicioDiv.onclick = seleccionarServicio;

      //inyectar precio y nombre al div de servicio

      servicioDiv.appendChild(nombreServicio);
      servicioDiv.appendChild(precioServicio);

      //inyectarlo al HTML
      document.querySelector("#servicios").appendChild(servicioDiv);
    });
  } catch (error) {
    console.log(error);
  }
}

function seleccionarServicio(e) {
  //Forzar que el elemento al cual damos click sea el div

  let elemento;

  if (e.target.tagName === "P") {
    elemento = e.target.parentElement;
  } else {
    elemento = e.target;
  }
  if (elemento.classList.contains("seleccionado")) {
    elemento.classList.remove("seleccionado");

    const id = parseInt(elemento.dataset.idServicio);
    eliminarServicio(id);
  } else {
    elemento.classList.add("seleccionado");
    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent,
    };
    agregarServicio(servicioObj);
  }
}

function eliminarServicio(id) {
  const { servicios } = cita;
  cita.servicios = servicios.filter((servicio) => servicio.id !== id);
}
function agregarServicio(servicioObj) {
  const { servicios } = cita;
  cita.servicios = [...servicios, servicioObj];
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");

  paginaSiguiente.addEventListener("click", () => {
    pagina++;
    botonesPaginador();
  });
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");

  paginaAnterior.addEventListener("click", () => {
    pagina--;
    botonesPaginador();
  });
}

function botonesPaginador() {
  const paginaSiguiente = document.querySelector("#siguiente");
  const paginaAnterior = document.querySelector("#anterior");

  if (pagina === 1) {
    paginaAnterior.classList.add("ocultar");
  } else if (pagina === 3) {
    paginaSiguiente.classList.add("ocultar");
    paginaAnterior.classList.remove("ocultar");
    mostrarResumen();
    //Pagina 3, carga el resumen de la cita
  } else {
    paginaSiguiente.classList.remove("ocultar");
    paginaAnterior.classList.remove("ocultar");
  }
  mostrarSeccion(); // cambia la seccion que se muestra
}

function mostrarResumen() {
  //destructuring
  const { nombre, fecha, hora, servicios } = cita;
  // seleccionar resumen
  const resumenDiv = document.querySelector(".contenido-resumen");

  // limpia el html previo
  while (resumenDiv.firstChild) {
    resumenDiv.removeChild(resumenDiv.firstChild);
  }

  // validacion de objeto
  if (Object.values(cita).includes("")) {
    const noServicios = document.createElement("P");
    noServicios.textContent =
      "Faltan datos de Servicios, hora , fecha o nombre";
    noServicios.classList.add("invalidar-cita");

    //agregar a resumen div
    resumenDiv.appendChild(noServicios);
    return;
  }
  //mostrar resumen
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de cita";

  const nombreCita = document.createElement("P");
  nombreCita.innerHTML = `<span>Nombre </span>${nombre}`;

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha </span>${fecha}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora </span>${hora}`;

  const serviciosCita = document.createElement("DIV");
  serviciosCita.classList.add("resumen-servicios");

  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";

  serviciosCita.appendChild(headingServicios);

  let cantidad = 0;

  //iterar sobre el arreglo de servicios

  servicios.forEach((servicio) => {
    const { nombre, precio } = servicio;
    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;
    const precioServicio = document.createElement("P");
    precioServicio.textContent = precio;
    precioServicio.classList.add("precio");

    const totalServicio = precio.split("$");
    cantidad += parseInt(totalServicio[1].trim());

    // colocar precio y texto en el div
    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    serviciosCita.appendChild(contenedorServicio);
  });
  resumenDiv.appendChild(headingCita);
  resumenDiv.appendChild(nombreCita);
  resumenDiv.appendChild(fechaCita);
  resumenDiv.appendChild(horaCita);
  resumenDiv.appendChild(serviciosCita);

  const cantidadPagar = document.createElement("P");
  cantidadPagar.classList.add("total");
  cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $ ${cantidad}`;
  resumenDiv.appendChild(cantidadPagar);

  console.log(cita);
}

function nombreCita() {
  const nombreInput = document.querySelector("#nombre");

  nombreInput.addEventListener("input", (e) => {
    const nombreTexto = e.target.value.trim();
    //validacion
    if (nombreTexto === "" || nombreTexto.length < 3) {
      mostrarAlerta("Nombre no valido", "error");
    } else {
      const alerta = document.querySelector(".alerta");
      if (alerta) {
        alerta.remove();
      }
      cita.nombre = nombreTexto;
    }
  });
  nombreInput.value = "";
}

function mostrarAlerta(mensaje, tipo) {
  // si hay alerrta previa no crear  otra
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    return;
  }
  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");

  if (tipo === "error") {
    alerta.classList.add("error");
  }

  //insertar en el formulario html
  const formulario = document.querySelector(".formulario");
  formulario.appendChild(alerta);

  //eliminar la alerta despues de 3 segundos
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

function fechaCita() {
  const fechaInput = document.querySelector("#fecha");
  fechaInput.addEventListener("input", (e) => {
    const dia = new Date(e.target.value).getUTCDay();

    if ([0, 6].includes(dia)) {
      e.preventDefault();
      fechaInput.value = "";
      mostrarAlerta("Fines de semana no validos", "error");
    } else {
      cita.fecha = fechaInput.value;
    }
  });
  fechaInput.value = "";
}

function deshabilitarFecha() {
  const inputFecha = document.querySelector("#fecha");
  const fechaAhora = new Date();

  const year = fechaAhora.getFullYear();
  const mes = fechaAhora.getMonth() + 1;
  const dia = fechaAhora.getDate() + 1;
  //formato AAAA-MM-DD
  const fechaDeshabilitar = `${year}-${mes}-${dia}`;
  inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", (e) => {
    const horaCita = e.target.value;
    const hora = horaCita.split(":");

    if (hora[0] < 10 || hora[0] > 20) {
      mostrarAlerta("Hora no valida", "error");
      setTimeout(() => {
        inputHora.value = "";
      }, 2000);
    } else {
      cita.hora = horaCita;
    }
  });
  inputHora.value = "";
}
