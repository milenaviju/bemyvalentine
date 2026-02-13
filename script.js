const TOTAL_SLIDES = 10;
const grid = document.getElementById("grid");

for(let i = 1; i <= TOTAL_SLIDES; i++){
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = `assets/${i}.png`;
  img.alt = `Slide ${i}`;

  card.appendChild(img);
  grid.appendChild(card);
}
