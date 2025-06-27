document.addEventListener('DOMContentLoaded', () => {
  const feed = document.getElementById('feed');
  const uploadForm = document.getElementById('uploadForm');

  let allPhotos = [];
  const localLikes = {};
  const localComments = {};

  // 1) Busca as fotos na API e renderiza
  async function fetchPhotos() {
    try {
      const res = await fetch('http://localhost:5000/api/photos');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      allPhotos = await res.json();
      renderPhotos();
    } catch (err) {
      console.error(err);
      feed.innerHTML = '<p>Erro ao carregar fotos.</p>';
    }
  }

  // 2) Monta o HTML de cada photo-card
  function renderPhotos() {
    if (allPhotos.length === 0) {
      feed.innerHTML = '<p>Nenhuma foto para exibir.</p>';
      return;
    }

    feed.innerHTML = allPhotos.map(photo => {
      const id       = photo.id;
      const likes    = (photo.likes_total || 0) + (localLikes[id] || 0);
      const comments = localComments[id] || [];

      return `
        <div class="photo-card" data-id="${id}">
          <img src="http://localhost:5000/uploads/${photo.image_path}"
               alt="${photo.description}" class="post-img" />
          <div class="desc">${photo.description}</div>
          <div class="user">Por: ${photo.user}</div>
          <div class="actions">
            <button class="like-btn">❤️ Curtir (${likes})</button>
            <button class="toggle-comments">💬 Comentários (${comments.length})</button>
          </div>
          <div class="comments" style="display:none;">
            ${comments.map(c => `<p><strong>${c.user}:</strong> ${c.text}</p>`).join('')}
            <form class="comment-form">
              <input type="text" placeholder="Digite um comentário" required />
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      `;
    }).join('');

    bindPhotoEvents();
  }

  // 3) Liga botões de Like e Comentários
  function bindPhotoEvents() {
    feed.querySelectorAll('.like-btn').forEach(btn => {
      btn.onclick = () => {
        const card = btn.closest('.photo-card');
        const id   = card.dataset.id;
        localLikes[id] = (localLikes[id] || 0) + 1;
        renderPhotos();
      };
    });

    feed.querySelectorAll('.toggle-comments').forEach(btn => {
      btn.onclick = () => {
        const card = btn.closest('.photo-card');
        const coms = card.querySelector('.comments');
        coms.style.display = coms.style.display === 'none' ? 'block' : 'none';
      };
    });

    feed.querySelectorAll('.comment-form').forEach(frm => {
      frm.onsubmit = e => {
        e.preventDefault();
        const card = frm.closest('.photo-card');
        const id   = card.dataset.id;
        const txt  = frm.querySelector('input').value.trim();
        if (!txt) return;
        if (!localComments[id]) localComments[id] = [];
        localComments[id].push({ user: 'Você', text: txt });
        renderPhotos();
      };
    });
  }

  // 4) Faz POST /api/photos e recarrega o feed
  uploadForm.onsubmit = async e => {
    e.preventDefault();
    const formData = new FormData(uploadForm);

    // **Importante**: verifique no seu HTML se
    //    <input type="file" name="image" id="photoInput" required>
    // e
    //    <input type="text" name="user"  id="userInput"  required>
    // estão declarados para a API receber os campos corretos.

    try {
      const res = await fetch('http://localhost:5000/api/photos', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      uploadForm.reset();
      await fetchPhotos();
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar foto.');
    }
  };

  // dispara o fetch inicial
  fetchPhotos();
});
