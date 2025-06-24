const API_URL = "http://localhost:5000/api/raspolozenja";
let editingId = null;

document.getElementById("formaRaspolozenje").addEventListener("submit", dodajNovo);
document.getElementById("gumbOtkazi").addEventListener("click", () => {
  resetForm();
});

function resetForm() {
  editingId = null;
  document.getElementById("formaRaspolozenje").reset();
  document.getElementById("gumbOtkazi").style.display = "none";
}

function dodajNovo(e) {
  e.preventDefault();
  const datum = document.getElementById("datum").value;
  const ocjena = parseInt(document.getElementById("ocjena").value);
  const opis = document.getElementById("opis").value;

  let method = "POST";
  let url = API_URL;
  if (editingId !== null) {
    method = "PUT";
    url = `${API_URL}/${editingId}`;
  }

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ datum, ocjena, opis })
  }).then(res => {
    if (res.ok) {
      ucitajRaspolozenja();
      resetForm();
    } else {
      alert("Greška prilikom spremanja.");
    }
  });
}

function ucitajRaspolozenja() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#raspolozenjaTabela tbody");
      tbody.innerHTML = "";
      data.sort((a, b) => new Date(b.datum) - new Date(a.datum));
      data.forEach(item => {
        const row = `<tr>
          <td>${new Date(item.datum).toLocaleDateString("hr-HR")}</td>
          <td>${item.ocjena}</td>
          <td>${item.opis || ""}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" onclick="uredi(${item.id})">Uredi</button>
            <button class="btn btn-sm btn-danger" onclick="obrisi(${item.id})">Obriši</button>
          </td>
        </tr>`;
        tbody.innerHTML += row;
      });
      nacrtajGraf(data);
    });
}

function obrisi(id) {
  if (!confirm("Jesi siguran da želiš obrisati ovaj unos?")) return;
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => {
      if (res.ok) ucitajRaspolozenja();
      else alert("Greška prilikom brisanja.");
    });
}

function uredi(id) {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const zapis = data.find(r => r.id === id);
      if (!zapis) return;
      editingId = id;
      document.getElementById("datum").value = new Date(zapis.datum).toISOString().split("T")[0];
      document.getElementById("ocjena").value = zapis.ocjena;
      document.getElementById("opis").value = zapis.opis;
      document.getElementById("gumbOtkazi").style.display = "inline-block";
    });
}

let chart = null;
function nacrtajGraf(podaci) {
  const ctx = document.getElementById("graf").getContext("2d");
  const datumi = podaci.map(x => new Date(x.datum).toLocaleDateString("hr-HR")).reverse();
  const ocjene = podaci.map(x => x.ocjena).reverse();

  if (chart) {
    chart.data.labels = datumi;
    chart.data.datasets[0].data = ocjene;
    chart.update();
    return;
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: datumi,
      datasets: [{
        label: "Raspoloženje",
        data: ocjene,
        borderColor: "blue",
        fill: false
      }]
    },
    options: { scales: { x: { display: true }, y: { beginAtZero: true, max: 10 } } }
  });
}

ucitajRaspolozenja();
