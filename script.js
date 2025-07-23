const API_BASE = 'https://rickandmortyapi.com/api/character';
let currentUrl = API_BASE;

const portalImage = "https://media.tenor.com/BgR83Df82t0AAAAj/portal-rick-and-morty.gif";

// Inputs
const nameInput = document.getElementById('name');
const statusInput = document.getElementById('status');
const genderInput = document.getElementById('gender');
const speciesInput = document.getElementById('species');
const filterBtn = document.getElementById('filterBtn');
const charactersDiv = document.getElementById('characters');
const statusMessage = document.getElementById('statusMessage');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

// Obtener personajes desde la API
async function obtenerPersonajes(url) {
  statusMessage.textContent = 'Cargando personajes...';
  charactersDiv.innerHTML = '';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se encontraron resultados.');
    const data = await res.json();

    mostrarPersonajes(data.results);
    actualizarPaginacion(data.info);
    statusMessage.textContent = '';
  } catch (err) {
    statusMessage.textContent = err.message;
    nextBtn.disabled = true;
    prevBtn.disabled = true;
  }
}

// Mostrar personajes con animación del portal
function mostrarPersonajes(personajes) {
  charactersDiv.innerHTML = personajes.map((personaje, index) => `
    <div class="bg-gray-800 p-4 rounded shadow relative overflow-hidden">
      <img id="portal-${index}" src="${portalImage}" alt="Portal" class="w-full h-48 object-cover rounded mb-2 transition-opacity duration-300" />
      <img id="char-${index}" src="${personaje.image}" alt="${personaje.name}"
           class="w-full h-48 object-cover rounded mb-2 absolute top-4 left-0 right-0 mx-auto opacity-0 transition-opacity duration-700" />
      <h2 class="text-xl font-bold">${personaje.name}</h2>
      <p><strong>Estado:</strong> ${traducirEstado(personaje.status)}</p>
      <p><strong>Especie:</strong> ${traducirEspecie(personaje.species)}</p>
    </div>
  `).join('');

  personajes.forEach((_, index) => {
    setTimeout(() => {
      const portalImg = document.getElementById(`portal-${index}`);
      const charImg = document.getElementById(`char-${index}`);
      if (portalImg && charImg) {
        portalImg.style.opacity = 0;
        charImg.style.opacity = 1;
      }
    }, 500 + index * 150);
  });
}

// Traducción de estado
function traducirEstado(estado) {
  switch (estado.toLowerCase()) {
    case 'alive': return 'Vivo';
    case 'dead': return 'Muerto';
    case 'unknown': return 'Desconocido';
    default: return estado;
  }
}

// Traducción de especie
function traducirEspecie(especie) {
  switch (especie.toLowerCase()) {
    case 'human': return 'Humano';
    case 'alien': return 'Alien';
    case 'animal': return 'Animal';
    case 'poopybutthole': return 'Mascota';
    case 'robot': return 'Robot';
    case 'unknown': return 'Desconocido';
    default: return especie;
  }
}

// Armar la URL con los filtros
function construirConsulta() {
  let query = [];
  if (nameInput.value) query.push(`name=${nameInput.value}`);
  if (statusInput.value) query.push(`status=${statusInput.value}`);
  if (genderInput.value) query.push(`gender=${genderInput.value}`);
  if (speciesInput.value) query.push(`species=${speciesInput.value}`);
  return `${API_BASE}?${query.join('&')}`;
}

// Manejo de paginación
function actualizarPaginacion(info) {
  nextBtn.disabled = !info.next;
  prevBtn.disabled = !info.prev;
  nextBtn.dataset.url = info.next;
  prevBtn.dataset.url = info.prev;
}

// Eventos
filterBtn.addEventListener('click', () => {
  currentUrl = construirConsulta();
  obtenerPersonajes(currentUrl);
});

nextBtn.addEventListener('click', () => {
  if (nextBtn.dataset.url) {
    currentUrl = nextBtn.dataset.url;
    obtenerPersonajes(currentUrl);
  }
});

prevBtn.addEventListener('click', () => {
  if (prevBtn.dataset.url) {
    currentUrl = prevBtn.dataset.url;
    obtenerPersonajes(currentUrl);
  }
});

// Cargar al iniciar
obtenerPersonajes(currentUrl);