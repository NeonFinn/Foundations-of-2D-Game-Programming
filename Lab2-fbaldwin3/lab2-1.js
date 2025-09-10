var canvas = document.getElementById('snailbait-game-canvas'),

   context = canvas.getContext('2d'),

   background  = new Image(),
   runnerImage = new Image();

function initializeImages() {
   console.log("Initializing images");

   background.src = 'images/background.png';
   runnerImage.src = 'images/runner.png';

   background.onload = function (e) {
      console.log("Background image loaded");

      startGame();
   };
}

function startGame() {
   console.log("Starting game");
   draw();
}

function draw() {
   console.log("Drawing frame");
   drawBackground();
   drawRunner();
}

function drawBackground() {
   console.log("Drawing background");
   context.drawImage(background, 0, 0);
}

function drawRunner() {
   console.log("Drawing runner");
   context.drawImage(runnerImage, 50, 280);
}

// Launch game.........................................................

initializeImages();
