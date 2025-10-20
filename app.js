// Formato de precio
const money = n => `$ ${Number(n).toLocaleString('es-AR')}`;

// DOM
const modal    = document.getElementById('modal');
const slidesEl = document.getElementById('slides');
const dotsEl   = document.getElementById('dots');
const titleEl  = document.getElementById('modalTitle');
const priceEl  = document.getElementById('modalPrice');
const descEl   = document.getElementById('modalDesc');
const closeBtn = document.getElementById('closeBtn');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
const backdrop = document.getElementById('backdrop');

let current = 0;
let images = [];
let lastFocus = null;

// Abrir modal con datos de la card
function openModal(card){
  lastFocus = document.activeElement;

  titleEl.textContent = card.dataset.name || '';
  priceEl.textContent = money(card.dataset.price || 0);
  descEl.textContent  = card.dataset.desc || '';

  try { images = JSON.parse(card.dataset.images || '[]'); }
  catch { images = []; }
  if(!Array.isArray(images)) images = [];

  // Slides
  slidesEl.innerHTML = images.map(src =>
    `<figure class="slide"><img src="${src}" alt="${card.dataset.name || ''}"></figure>`
  ).join('');

  // Dots
  dotsEl.innerHTML = images.map((_,i)=>
    `<span class="dot${i===0?' active':''}" data-i="${i}"></span>`
  ).join('');

  current = 0;
  updateCarousel();

  modal.classList.add('modal--open');
  closeBtn.focus();
}

// Cerrar modal
function closeModal(){
  modal.classList.remove('modal--open');
  if(lastFocus) lastFocus.focus();
}

// Mover slides
function updateCarousel(){
  const slideWidth = slidesEl.firstElementChild
    ? slidesEl.firstElementChild.getBoundingClientRect().width
    : 0;
  // usar px para evitar errores si --cw cambia por media query
  slidesEl.style.transform = `translateX(${-current * slideWidth}px)`;

  [...dotsEl.children].forEach((d,i)=> d.classList.toggle('active', i===current));

  const many = images.length > 1;
  prevBtn.style.display = many ? '' : 'none';
  nextBtn.style.display = many ? '' : 'none';
}

function next(){ if(images.length){ current = (current + 1) % images.length; updateCarousel(); } }
function prev(){ if(images.length){ current = (current - 1 + images.length) % images.length; updateCarousel(); } }

// Abrir desde la grilla (delegación)
document.getElementById('grid').addEventListener('click', e=>{
  const btn = e.target.closest('.card-link');
  if(!btn) return;
  openModal(btn.closest('.card'));
});

// Dots
dotsEl.addEventListener('click', e=>{
  const dot = e.target.closest('.dot');
  if(!dot) return;
  current = Number(dot.dataset.i) || 0;
  updateCarousel();
});

// Controles y cierre
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);
closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

// Teclado
window.addEventListener('keydown', e=>{
  if(!modal.classList.contains('modal--open')) return;
  if(e.key === 'Escape')     closeModal();
  if(e.key === 'ArrowRight') next();
  if(e.key === 'ArrowLeft')  prev();
});

// Recalcular al cambiar tamaño (por si cambia --cw por media query)
window.addEventListener('resize', ()=>{
  if(modal.classList.contains('modal--open')) updateCarousel();
});



