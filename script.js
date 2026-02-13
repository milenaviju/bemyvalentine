const TOTAL_SLIDES = 10;

const slides = Array.from({ length: TOTAL_SLIDES }, (_, i) => ({
  id: i + 1,
  src: `assets/${i + 1}.png`
}));

const viewport = document.getElementById("viewport");
const dots = document.getElementById("dots");
const counter = document.getElementById("counter");

const likeBtn = document.getElementById("likeBtn");
const reelBottom = document.getElementById("reelBottom");

let current = 0;

// Preload around current for smoother swipe
function preloadAround(index){
  const ids = [index, index + 1, index - 1].map(i => (i + slides.length) % slides.length);
  ids.forEach(i => {
    const img = new Image();
    img.src = slides[i].src;
  });
}

function placeholder(id){
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1600">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <text x="50%" y="50%" text-anchor="middle"
        font-family="Arial" font-size="36" fill="#999">
        Missing: assets/${id}.png
      </text>
    </svg>
  `);
}

function ensureHeartsLayer(){
  let layer = reelBottom.querySelector(".hearts-layer");
  if(!layer){
    layer = document.createElement("div");
    layer.className = "hearts-layer";
    reelBottom.appendChild(layer);
  }
  return layer;
}

function spawnHearts(count = 6){
  const layer = ensureHeartsLayer();
  const hearts = ["💖","💗","💞","💕","💘"];

  for(let i=0;i<count;i++){
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const drift = (Math.random() * 120) - 60; // -60..60
    const delay = Math.random() * 180;        // 0..180ms
    const size = 14 + Math.random() * 10;     // 14..24px

    h.style.left = `${18 + drift}px`;
    h.style.animationDelay = `${delay}ms`;
    h.style.fontSize = `${size}px`;

    layer.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
}

function render(){
  viewport.innerHTML = "";
  dots.innerHTML = "";

  slides.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "slide" + (i === current ? " active" : "");

    const img = document.createElement("img");
    img.src = s.src;
    img.alt = `Slide ${s.id}`;
    img.onerror = () => img.src = placeholder(s.id);

    slide.appendChild(img);
    viewport.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "dot" + (i === current ? " active" : "");
    dot.type = "button";
    dot.ariaLabel = `Go to slide ${i + 1}`;
    dot.addEventListener("click", () => go(i));
    dots.appendChild(dot);
  });

  counter.textContent = `${current + 1} / ${slides.length}`;
  preloadAround(current);
}

function go(i){
  current = (i + slides.length) % slides.length;
  render();
}

// Nav buttons
document.getElementById("nextBtn").addEventListener("click", () => go(current + 1));
document.getElementById("prevBtn").addEventListener("click", () => go(current - 1));

// Keyboard
window.addEventListener("keydown", (e) => {
  if(e.key === "ArrowRight") go(current + 1);
  if(e.key === "ArrowLeft") go(current - 1);
});

// Swipe
let startX = null;
viewport.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive:true });

viewport.addEventListener("touchend", (e) => {
  if(startX == null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if(Math.abs(dx) > 40){
    dx < 0 ? go(current + 1) : go(current - 1);
  }
  startX = null;
});

// Like + heart magic
if(likeBtn){
  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("liked");
    spawnHearts(likeBtn.classList.contains("liked") ? 10 : 6);
  });
}

// init
render();
