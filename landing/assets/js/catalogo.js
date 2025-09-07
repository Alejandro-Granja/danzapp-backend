const API = "http://localhost:3000/api/danzas";

async function cargarCatalogo() {
  const res = await fetch(API);
  const danzas = await res.json();
  const grid = document.getElementById("gridDanzas");
  grid.innerHTML = danzas.map(d => `
    <article class="border rounded-lg p-4 shadow-sm">
      <img src="${d.imagenUrl || 'assets/img/placeholder.jpg'}" alt="${d.nombre}" class="w-full h-40 object-cover rounded">
      <h3 class="mt-2 text-xl font-semibold">${d.nombre}</h3>
      <p class="text-sm text-slate-600">${d.region}</p>
      <p class="mt-2 line-clamp-3">${d.descripcion || ''}</p>
      <button class="mt-3 underline" onclick='verDetalle(${JSON.stringify(d)})'>Ver más</button>
    </article>
  `).join("");
}

function verDetalle(d) {
  const modal = document.getElementById("detalle");
  modal.querySelector(".titulo").textContent = d.nombre;
  modal.querySelector(".region").textContent = d.region;
  modal.querySelector(".descripcion").textContent = d.descripcion || "";
  modal.querySelector(".origen").textContent = d.origen || "";
  modal.classList.remove("hidden");
}

window.addEventListener("DOMContentLoaded", cargarCatalogo);
