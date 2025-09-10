var canvas = document.getElementById('snailbait-game-canvas'),
    context = canvas.getContext('2d');

    PLATFORM_HEIGHT = 8,
    PLATFORM_STROKE_WIDTH = 2,
    PLATFORM_STROKE_STYLE = '#000000',

    STARTING_RUNNER_LEFT = 50,
    STARTING_RUNNER_TRACK = 1,

    TRACK_1_BASELINE = 323,
    TRACK_2_BASELINE = 223,
    TRACK_3_BASELINE = 123,

    background = new Image(),
    runner = new Image(),

    platformData = [
       {
          left: 10,
          width: 230,
          height: PLATFORM_HEIGHT,
          fillStyle: 'rgb(250,250,0)',
          opacity: 0.5,
          track: 1,
          pulsate: false,
       },

       {
           left: 250,
           width: 100,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(150,190,225)',
           opacity: 1,
           track: 2,
           pulsate: false,
       },

       {
           left: 400,
           width: 125,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(250,0,0)',
           opacity: 0.5,
           track: 3,
           pulsate: false,
       },

       {
           left: 633,
           width: 100,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(250,250,0)',
           opacity: 1,
           track: 1,
           pulsate: false,
       }
    ];

    // launch game

    initializeImages();

    function initializeImages() {
       background.src = 'images/background.png';
       runner.src = 'images/runner.png';

       background.onload = function(e) {
          startGame();
       };
    }

    function startGame() {
       draw();
    }

    function draw() {
       drawBackground();
    }

    function drawBackground() {
       context.drawImage(background, 0, 0);
    }

    function drawPlatforms() {
       var data,
           platformTop,
           index;

       context.save();

       for (index = 0; index < platformData.length; ++index) {
          data = platformData[index];
          platformTop = calculatePlatformTop(data.track)

          context.lineWidth = PLATFORM_STROKE_WIDTH;
          context.strokeStyle = PLATFORM_STROKE_STYLE;
          context.fillStyle = data.fillStyle;
          context.globalAlpha = data.opacity;

          context.strokeRect(data.left, platformTop, data.width, data.height);
          context.fillRect(data.left, platformTop, data.width, data.height);
       }

       context.restore();
    }

    function calculatePlatformTop(track) {
       var top;

       if (track === 1) {top = TRACK_1_BASELINE;)
       else if (track === 2) {top = TRACK_2_BASELINE;}
       else if (track === 3) {top = TRACK_3_BASELINE;}

       return top - PLATFORM_HEIGHT;
    }