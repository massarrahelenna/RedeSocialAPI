const form = document.getElementById("uploadForm");
const gallery = document.getElementById("gallery");

// Função para buscar fotos e mostrar na galeria
async function loadPhotos() {
  gallery.innerHTML = "Carregando fotos...";
  try {
    const res = await fetch("http://localhost:5000/api/photos");
    const photos = await res.json();

    if (photos.length === 0) {
      gallery.innerHTML = "<p>Nenhuma foto enviada ainda.</p>";
      return;
    }

    gallery.innerHTML = "";
    photos.forEach(photo => {
      const card = document.createElement("div");
      card.classList.add("photo-card");
      card.innerHTML = `
        <img src="http://localhost:5000/uploads/${photo.image_path}" alt="Foto" />
        <div class="desc">${photo.description}</div>
        <div class="user">Por: ${photo.user}</div>
      `;
      gallery.appendChild(card);
    });
  } catch (err) {
    gallery.innerHTML = "<p>Erro ao carregar fotos.</p>";
    console.error(err);
  }
}

// Evento do formulário
form.addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const res = await fetch("http://localhost:5000/api/photos", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Erro ao enviar foto");

    alert("Foto enviada com sucesso!");
    form.reset();
    loadPhotos(); // Atualiza a galeria
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
});

// Carrega fotos ao abrir a página
loadPhotos();
