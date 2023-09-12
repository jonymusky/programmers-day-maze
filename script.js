const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;
const magicNumber = 16;
const grid = Array(magicNumber+1).fill(null).map(() => Array(magicNumber+1).fill('wall'));
let start = null;
let end = null;
let player = null;
let moveCount = 0; 

// Generate maze using Prim's algorithm
function generateMaze() {
  const walls = [];
  start = { x: 0, y: 0 };
  grid[start.y][start.x] = 'empty';
  walls.push({ x: start.x, y: start.y - 1 });
  walls.push({ x: start.x, y: start.y + 1 });
  walls.push({ x: start.x - 1, y: start.y });
  walls.push({ x: start.x + 1, y: start.y });

  while (walls.length > 0) {
    const randomIndex = Math.floor(Math.random() * walls.length);
    const wall = walls.splice(randomIndex, 1)[0];
    
    if (wall.x >= 0 && wall.y >= 0 && wall.x < magicNumber && wall.y < magicNumber) {
      const neighbours = [
        { x: wall.x, y: wall.y - 1, dir: 'n' },
        { x: wall.x, y: wall.y + 1, dir: 's' },
        { x: wall.x - 1, y: wall.y, dir: 'w' },
        { x: wall.x + 1, y: wall.y, dir: 'e' },
      ].filter(n => n.x >= 0 && n.y >= 0 && n.x < magicNumber && n.y < magicNumber);

      const emptyNeighbours = neighbours.filter(n => grid[n.y][n.x] === 'empty');

      if (emptyNeighbours.length === 1) {
        const neighbour = emptyNeighbours[0];
        grid[wall.y][wall.x] = 'empty';

        neighbours.forEach(n => {
          if (grid[n.y][n.x] === 'wall') {
            walls.push(n);
          }
        });
      }
    }
  }

  end = { x: 15, y: 15 };
  player = { ...start };
}

// Draw the maze
function drawMaze() {
ctx.clearRect(0, 0, 640, 640);

  for (let y = 0; y < magicNumber; y++) {
    for (let x = 0; x < magicNumber; x++) {
      if (grid[y][x] === 'wall') {
        ctx.fillStyle = 'black';
      } else {
        ctx.fillStyle = 'white';
      }

      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Draw start, end and player
  ctx.fillStyle = 'blue';
  ctx.fillRect(start.x * cellSize, start.y * cellSize, cellSize, cellSize);

  ctx.fillStyle = 'green';
  ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);

  ctx.fillStyle = 'red';
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);

  // Dibujar contador de movimientos
ctx.fillStyle = 'red';  // Cambiamos el color a rojo para que sea más visible
ctx.font = '18px Arial';
ctx.fillText(`Moves: ${moveCount}`, 10, 30);
}

// Move player
function movePlayer(e) {
  let dx = 0, dy = 0;

  if (e.key === 'ArrowUp') dy = -1;
  if (e.key === 'ArrowDown') dy = 1;
  if (e.key === 'ArrowLeft') dx = -1;
  if (e.key === 'ArrowRight') dx = 1;

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (newX >= 0 && newY >= 0 && newX < magicNumber && newY < magicNumber && grid[newY][newX] !== 'wall') {
    player.x = newX;
    player.y = newY;
    moveCount++;  // Nuevo: Incrementar el contador de movimientos

    if (player.x === end.x && player.y === end.y) {
      alert(`¡Felicidades! Has llegado al final en ${moveCount} movimientos.`);
    }
  }

  drawMaze();
}

generateMaze();
drawMaze();
document.addEventListener('keydown', movePlayer);
