const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
let segments = ["Premio 1", "Premio 2", "Premio 3", "Premio 4", "Premio 5", "Premio 6", "Premio 7", "Premio 8"];
const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF8C00", "#8A2BE2", "#3CB371", "#DC143C"];
let startAngle = 0;
let anglePerSegment = 2 * Math.PI / segments.length;

const inputsDiv = document.getElementById("inputs");
function renderInputs() {
  inputsDiv.innerHTML = "";
  segments.forEach((seg, i) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = seg;
    input.dataset.index = i;
    inputsDiv.appendChild(input);
  });
}

function updateSegments() {
  const inputs = document.querySelectorAll("#inputs input");
  segments = Array.from(inputs).map(input => input.value || `Premio ${parseInt(input.dataset.index)+1}`);
  anglePerSegment = 2 * Math.PI / segments.length;
  drawWheel();
}

function drawWheel() {
  ctx.clearRect(0, 0, 300, 300);
  for (let i = 0; i < segments.length; i++) {
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.fillStyle = colors[i % colors.length];
    ctx.arc(150, 150, 150, startAngle + i * anglePerSegment, startAngle + (i + 1) * anglePerSegment);
    ctx.fill();
    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(startAngle + i * anglePerSegment + anglePerSegment / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(segments[i], 140, 5);
    ctx.restore();
  }
}

function spin(player) {
  let validIndexes = [];
  if (player === 1) validIndexes = segments.map((_, i) => i).filter(i => i % 2 === 0);
  else validIndexes = segments.map((_, i) => i).filter(i => i % 2 !== 0);

  const index = validIndexes[Math.floor(Math.random() * validIndexes.length)];
  const spins = Math.floor(Math.random() * 5) + 5;
  const targetAngle = (segments.length - index) * anglePerSegment;
  const angle = spins * 2 * Math.PI + targetAngle;
  const duration = 3000;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    if (elapsed < duration) {
      const currentAngle = angle * (elapsed / duration);
      ctx.clearRect(0, 0, 300, 300);
      startAngle = currentAngle % (2 * Math.PI);
      drawWheel();
      requestAnimationFrame(animate);
    } else {
      startAngle = angle % (2 * Math.PI);
      drawWheel();
      const playerName = player === 1 ? document.getElementById("player1Name").value : document.getElementById("player2Name").value;
      alert(`🎉 ${playerName} obtuvo: ${segments[index]}`);
    }
  }
  requestAnimationFrame(animate);
}

document.getElementById("update").onclick = updateSegments;
document.getElementById("spinP1").onclick = () => spin(1);
document.getElementById("spinP2").onclick = () => spin(2);

function toggleConfig() {
  const panel = document.getElementById("configPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

renderInputs();
drawWheel();
