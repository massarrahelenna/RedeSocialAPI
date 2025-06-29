const samplePosts = [
  { user: 'João Silva',      desc: 'Aproveitando o dia ensolarado!',               url: 'https://via.placeholder.com/250x150?text=Post+1', alt: 'João ao sol' },
  { user: 'Maria Oliveira',   desc: 'Deliciosa receita de bolo de chocolate!',       url: 'https://via.placeholder.com/250x150?text=Post+2', alt: 'Bolo de chocolate' },
  { user: 'Helenna Massarra', desc: 'Explorando novas trilhas!',                     url: 'https://via.placeholder.com/250x150?text=Post+3', alt: 'Trilha na montanha' },
  { user: 'Artur Moraes',     desc: 'Dia de praia com os amigos!',                   url: 'https://via.placeholder.com/250x150?text=Post+4', alt: 'Amigos na praia' },
  { user: 'Andreia Lima',     desc: 'Apreciando um bom livro.',                       url: 'https://via.placeholder.com/250x150?text=Post+5', alt: 'Pessoa lendo livro' }
];

const main    = document.querySelector('main');
const loading = document.getElementById('posts-loading');
const tpl     = document.getElementById('post-template');

function renderPosts(posts) {
  loading.remove();
  posts.forEach(p => {
    const card = tpl.content.cloneNode(true);

    card.querySelector('.post-user').textContent = p.user;
    card.querySelector('.desc').textContent      = p.desc;
    const img = card.querySelector('img');
    img.src = p.url; img.alt = p.alt;

    // Curtir
    const likeBtn   = card.querySelector('.like-btn');
    const likeCount = card.querySelector('.like-count');
    likeBtn.addEventListener('click', () => {
      likeCount.textContent = +likeCount.textContent + 1;
    });

    // Comentar
    const commentBtn   = card.querySelector('.comment-btn');
    const commentsSec  = card.querySelector('.comments');
    const commentList  = card.querySelector('.comment-list');
    const commentInput = card.querySelector('.comment-input');
    commentBtn.addEventListener('click', () => {
      const isVisible = commentsSec.style.display === 'flex';
      commentsSec.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) commentInput.focus();
    });
    commentInput.addEventListener('keypress', e => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        const div = document.createElement('div');
        div.className = 'comment';
        div.textContent = e.target.value.trim();
        commentList.append(div);
        e.target.value = '';
      }
    });

    main.append(card);
  });
}

// Simula carregamento de API
setTimeout(() => renderPosts(samplePosts), 800);
