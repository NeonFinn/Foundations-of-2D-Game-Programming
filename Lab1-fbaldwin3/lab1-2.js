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
   drawRunner();
}

function drawBackground() {
   context.drawImage(background, 0, 0);
}

function drawRunner() {
   context.drawImage(runnerImage, 550, 130);
}

// Launch game.........................................................

initializeImages();
