var canvas = document.getElementById('snailbait-game-canvas'),

   context = canvas.getContext('2d'),

   background  = new Image(),
   runnerImage = new Image();

function initializeImages() {
   background.src = 'images/background.png';
   runnerImage.src = 'images/runner.png';

   background.onload = function (e) {

      startGame();
   };
}

function startGame() {
   draw();
}

function draw() {
   drawBackground(0, 0);
   drawBackground(43, 54);
   drawBackground(-100, 150);
   drawRunner();
}

function drawBackground(x, y) {
   context.drawImage(background, x, y);
}

function drawRunner() {
   context.drawImage(runnerImage, 50, 280);
}

// Launch game.........................................................

initializeImages();
