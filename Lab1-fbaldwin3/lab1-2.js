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
   drawBackground();
   drawRunner(550, 130);
   drawRunner(50, 280)
   drawRunner(250, 45);
}

function drawBackground() {
   context.drawImage(background, 0, 0);
}

function drawRunner(x, y) {
   context.drawImage(runnerImage, x, y);
}

// Launch game.........................................................

initializeImages();
