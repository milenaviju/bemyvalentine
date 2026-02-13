const TOTAL_SLIDES = 10;
let current = 1;

const img = document.getElementById("slideImg");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

function setSlide(n){
  current = ((n - 1 + TOTAL_SLIDES) % TOTAL_SLIDES) + 1;
  img.src = `assets/${current}.png`;
}

img.addEventListener("error", () => {
  // fallback placeholder if an image is missing
  img.src =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1600">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <text x="50%" y="50%" text-anchor="middle"
          font-family="Arial" font-size="36" fill="#999">
          Missing: assets/${current}.png
        </text>
      </svg>
    `);
});

prev.addEventListener("click", () => setSlide(current - 1));
next.addEventListener("click", () => setSlide(current + 1));

// click on image = next (super clean, no UI needed)
img.addEventListener("click", () => setSlide(current + 1));

setSlide(1);
