const API = "/api/danzas";  // misma-origin, evita CORS
const form = document.getElementById("formDanza");
const tbody = document.getElementById("tbody");
let editId = null;

async function listar() {
  const res = await fetch(API);
  const danzas = await res.json();
  tbody.innerHTML = danzas.map(d => `
    <tr>
      <td>${d.nombre}</td>
      <td>${d.region}</td>
      <td>${(d.descripcion || '').slice(0,60)}...</td>
      <td class="space-x-2">
        <button onclick='editar("${d.id}")' class="underline">Editar</button>
        <button onclick='eliminar("${d.id}")' class="underline text-red-600">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const method = editId ? "PUT" : "POST";
  const url = editId ? `${API}/${editId}` : API;

  const res = await fetch(url, {
    method, headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) return alert("Error guardando");
  form.reset(); editId = null; await listar();
});

async function editar(id) {
  const d = await (await fetch(`${API}/${id}`)).json();
  editId = id;
  form.nombre.value = d.nombre;
  form.region.value = d.region;
  form.descripcion.value = d.descripcion || "";
  form.origen.value = d.origen || "";
  form.imagenUrl.value = d.imagenUrl || "";
  form.videoUrl.value = d.videoUrl || "";
}

async function eliminar(id) {
  if (!confirm("¿Eliminar danza?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  await listar();
}

window.addEventListener("DOMContentLoaded", listar);
