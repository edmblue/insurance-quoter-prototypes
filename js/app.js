/** Codigo proyecto **/

/* Variables */

const yearSelect = document.querySelector('#year');
const formulario = document.querySelector('#cotizar-seguro');
const marcaSelect = document.querySelector('#marca');
const resultado = document.querySelector('#resultado');

/* Constructores */
function UI() {}

function Seguro(marca, tipo, year) {
  this.marca = marca;
  this.tipo = tipo;
  this.year = year;
}

// Instanciar el constructor

const ui = new UI();

// Protos

Seguro.prototype.cotizarPoliza = function () {
  const base = 2000;
  let total = '';
  let cantidadAsignadaTipo = '';
  let diferenciaYears = new Date().getFullYear() - this.year;

  if (this.tipo === 'basico') {
    cantidadAsignadaTipo = 0.3;
  } else if (this.tipo === 'completo') {
    cantidadAsignadaTipo = 0.5;
  }

  if (this.marca === '1') {
    total = base * 1.15;
    total += total * cantidadAsignadaTipo;
    total -= total * 0.03 * diferenciaYears;
  } else if (this.marca === '2') {
    total = base * 1.05;
    total += total * cantidadAsignadaTipo;
    total -= total * 0.03 * diferenciaYears;
  } else if (this.marca === '3') {
    total = base * 1.35;
    total += total * cantidadAsignadaTipo;
    total -= total * 0.03 * diferenciaYears;
  }

  return total;
};

UI.prototype.mostrarResultado = function (total, seguro) {
  if (resultado.firstChild != null) {
    resultado.firstChild.remove();
  }

  const { marca, tipo, year } = seguro;
  const resultadoRow = document.createElement('div');
  let marcaNombre = '';

  switch (marca) {
    case '1':
      marcaNombre = 'Americano';
      break;
    case '2':
      marcaNombre = 'Asiatico';
      break;
    case '3':
      marcaNombre = 'Europeo';
      break;
    default:
      break;
  }

  resultadoRow.classList.add('mt-10');
  resultado.style.display = 'none';
  resultadoRow.innerHTML = `
  <p class='header'>Tu Resumen: </p>
  <p class="font-bold">Marca: <span class="font-normal capitalize"> ${marcaNombre} </span> </p>
  <p class="font-bold">Año: <span class="font-normal"> ${year} </span> </p>
  <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo} </span> </p>
  <p class="font-bold"> Total: <span class="font-normal capitalize"> $ ${total} </span> </p>
`;

  resultado.appendChild(resultadoRow);

  setTimeout(() => {
    resultado.style.display = 'block';
  }, 1000);
};

UI.prototype.fillYears = () => {
  const currentYear = new Date().getFullYear();
  const min = currentYear - 12;

  for (let i = currentYear; i >= min; i--) {
    const yearRow = document.createElement('option');
    yearRow.value = i;
    yearRow.textContent = i;
    yearSelect.appendChild(yearRow);
  }
};

UI.prototype.showMessaje = function (mensaje, tipo) {
  const spinner = document.querySelector('#cargando');
  const div = document.createElement('div');
  div.classList.add('mt-10');
  div.innerHTML = `<p>${mensaje}</p>`;

  if (tipo == 'error') {
    div.classList.add('error');
    formulario.insertBefore(div, resultado);
    setTimeout(() => {
      div.remove();
    }, 1000);

    return;
  } else if (tipo == 'exito') {
    div.classList.add('correcto');
    formulario.insertBefore(div, resultado);
    spinner.style.display = 'block';

    setTimeout(() => {
      div.remove();
      spinner.style.display = 'none';
    }, 1000);
  }
};

/* EventListeners */

callEventListeners();

function callEventListeners() {
  document.addEventListener('DOMContentLoaded', startApp);
  document.addEventListener('submit', submitInfo);
}

function startApp() {
  ui.fillYears();
}

function submitInfo(e) {
  e.preventDefault();

  const year = yearSelect.value;
  const marca = marcaSelect.value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (year === '' || marca === '' || tipo === '') {
    ui.showMessaje('Debes rellenar todos los campos', 'error');
    return;
  }

  const seguro = new Seguro(marca, tipo, year);

  let cotizacionPrecio = seguro.cotizarPoliza();

  ui.showMessaje('Cotizando', 'exito');
  ui.mostrarResultado(cotizacionPrecio, seguro);
}
