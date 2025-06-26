const gallery = document.getElementById("gallery");
const form = document.getElementById("uploadForm");
const userInput = document.getElementById("user");
const btnAll = document.getElementById("btnAll");
const btnMine = document.getElementById("btnMine");

let allPhotos = [];
let currentView = "all";
let localComments = {};
let localLikes = {};

async function fetchPhotos() {
  try {
    const res = await fetch("http://localhost:5000/api/photos");
    allPhotos = await res.json();
    renderPhotos();
  } catch (err) {
    gallery.innerHTML = "<p>Erro ao carregar fotos.</p>";
  }
}

function renderPhotos() {
  const username = userInput.value.trim().toLowerCase();
  const filtered = currentView === "mine" && username
    ? allPhotos.filter(p => p.user.toLowerCase() === username)
    : allPhotos;

  gallery.innerHTML = filtered.length === 0
    ? "<p>Nenhuma foto para exibir.</p>"
    : filtered.map(photo => {
        const photoId = photo.id || photo.image_path;
        const likes = localLikes[photoId] || 0;
        const comments = localComments[photoId] || [];

        return `
          <div class="photo-card">
            <img src="http://localhost:5000/uploads/${photo.image_path}" />
            <div class="desc">${photo.description}</div>
            <div class="user">Por: ${photo.user}</div>
            <div class="actions">
              <button class="like-btn" data-id="${photoId}">❤️ Curtir (${likes})</button>
              <button class="toggle-comments" data-id="${photoId}">💬 Comentários (${comments.length})</button>
            </div>
            <div class="comments" id="comments-${photoId}" style="display:none;">
              ${comments.map(c => `<p><strong>${c.user}:</strong> ${c.text}</p>`).join("")}
              <form class="comment-form" data-id="${photoId}">
                <input type="text" placeholder="Digite um comentário" required />
                <button type="submit">Enviar</button>
              </form>
            </div>
          </div>
        `;
      }).join("");

  attachLikeHandlers();
  attachCommentHandlers();
  attachToggleCommentSections();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  try {
    await fetch("http://localhost:5000/api/photos", {
      method: "POST",
      body: data
    });
    form.reset();
    await fetchPhotos();
  } catch (err) {
    alert("Erro ao enviar foto.");
  }
});

btnAll.addEventListener("click", () => {
  currentView = "all";
  btnAll.classList.add("active");
  btnMine.classList.remove("active");
  renderPhotos();
});

btnMine.addEventListener("click", () => {
  currentView = "mine";
  btnMine.classList.add("active");
  btnAll.classList.remove("active");
  renderPhotos();
});

function attachLikeHandlers() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      localLikes[id] = (localLikes[id] || 0) + 1;
      renderPhotos();
    });
  });
}

function attachToggleCommentSections() {
  document.querySelectorAll(".toggle-comments").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const box = document.getElementById(`comments-${id}`);
      box.style.display = box.style.display === "none" ? "block" : "none";
    });
  });
}

function attachCommentHandlers() {
  document.querySelectorAll(".comment-form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = form.dataset.id;
      const input = form.querySelector("input");
      const text = input.value.trim();
      const user = userInput.value.trim() || "Anônimo";

      if (!localComments[id]) localComments[id] = [];
      localComments[id].push({ user, text });

      input.value = "";
      renderPhotos(); // re-render para atualizar comentário
    });
  });
}

fetchPhotos();
