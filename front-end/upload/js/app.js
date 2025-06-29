const form         = document.getElementById('uploadForm');
const imgInput     = document.getElementById('image');
const previewCt    = document.getElementById('preview-container');
const previewImg   = document.getElementById('preview');
const previewDesc  = document.getElementById('preview-desc');
const spinner      = document.getElementById('formSpinner');
const submitBtn    = document.getElementById('submitBtn');
const gallery      = document.getElementById('gallery');
const template     = document.getElementById('photo-template');

// Preview da imagem
imgInput.addEventListener('change', () => {
  const file = imgInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src         = e.target.result;
    previewDesc.textContent = document.getElementById('description').value;
    previewCt.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// Envio do formulário
form.addEventListener('submit', async e => {
  e.preventDefault();
  ['error-image','error-user','error-desc']
    .forEach(id => document.getElementById(id).textContent = '');

  let valid = true;
  if (!imgInput.files.length) {
    document.getElementById('error-image').textContent = 'Selecione uma imagem.';
    valid = false;
  }
  if (!form.user.value.trim()) {
    document.getElementById('error-user').textContent = 'Informe seu nome.';
    valid = false;
  }
  if (!form.description.value.trim()) {
    document.getElementById('error-desc').textContent = 'Descrição obrigatória.';
    valid = false;
  }
  if (!valid) return;

  submitBtn.disabled = true;
  spinner.style.display = 'block';
  await new Promise(r => setTimeout(r, 1000));
  spinner.style.display = 'none';
  submitBtn.disabled = false;

  // Atualiza galeria
  const card = template.content.cloneNode(true);
  const imgEl = card.querySelector('img');
  const descEl = card.querySelector('.desc');
  const userEl = card.querySelector('.user');
  imgEl.src       = previewImg.src;
  imgEl.alt       = form.description.value;
  descEl.textContent = form.description.value;
  userEl.textContent = form.user.value;
  gallery.prepend(card);

  form.reset();
  previewCt.style.display = 'none';
});

// Carrega fotos iniciais (simulado)
async function fetchPhotos() {
  gallery.textContent = 'Carregando fotos…';
  await new Promise(r => setTimeout(r, 800));
  gallery.textContent = '';
  const photos = []; // substituir por fetch real
  if (!photos.length) {
    gallery.textContent = 'Nenhuma foto para exibir.';
    return;
  }
  photos.forEach(p => {
    const card = template.content.cloneNode(true);
    const imgEl = card.querySelector('img');
    const descEl = card.querySelector('.desc');
    const userEl = card.querySelector('.user');
    imgEl.src = p.url; imgEl.alt = p.description;
    descEl.textContent = p.description;
    userEl.textContent = p.user;
    gallery.append(card);
  });
}
fetchPhotos();
