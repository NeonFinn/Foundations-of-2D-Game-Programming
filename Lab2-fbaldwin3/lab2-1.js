var canvas = document.getElementById('snailbait-game-canvas'),
    context = canvas.getContext('2d'),

    PLATFORM_HEIGHT = 8,
    PLATFORM_STROKE_WIDTH = 2,
    PLATFORM_STROKE_STYLE = '#000000',

    STARTING_RUNNER_LEFT = 50,
    STARTING_RUNNER_TRACK = 1,

    TRACK_1_BASELINE = 323,
    TRACK_2_BASELINE = 223,
    TRACK_3_BASELINE = 123,

    STARTING_BACKGROUND_VELOCITY = .1,
    STARTING_BACKGROUND_OFFSET = 0,

    background = new Image(),
    runner = new Image(),

    lastAnimationFrameTime = 0,
    lastFpsUpdateTime = 0,
    fps = 60,

    fpsElement = document.getElementById('fps'),

    runnerTrack = STARTING_RUNNER_TRACK,

    backgroundOffset = STARTING_BACKGROUND_OFFSET,

    bgVelocity = STARTING_BACKGROUND_VELOCITY,

    platformData = [
       // screen 1
       {
          left: 10,
          width: 230,
          height: PLATFORM_HEIGHT,
          fillStyle: 'rgb(250,250,0)',
          opacity: 1,
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
           opacity: 1,
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
       },

       // screen 2
       {
            left: 810,
            width: 100,
            height: PLATFORM_HEIGHT,
            fillStyle: 'rgb(200,200,0)',
            opacity: 1,
            track: 2,
            pulsate: false,
         },

         {
             left: 1025,
             width: 125,
             height: PLATFORM_HEIGHT,
             fillStyle: 'rgb(80,140,230)',
             opacity: 1,
             track: 3,
             pulsate: false,
         },

         {
             left: 633,
             width: 100,
             height: PLATFORM_HEIGHT,
             fillStyle: 'rgb(200,200,0)',
             opacity: 1,
             track: 1,
             pulsate: false,
         },

         {
             left: 1450,
             width: 100,
             height: PLATFORM_HEIGHT,
             fillStyle: 'rgb(150,190,225)',
             opacity: 1,
             track: 2,
             pulsate: false,
       },

       // screen 3
       {
           left: 1700,
           width: 125,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(250,0,0)',
           opacity: 1,
           track: 3,
           pulsate: false,
       },

       {
           left: 1933,
           width: 100,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(250,250,0)',
           opacity: 1,
           track: 1,
           pulsate: false,
       },

       {
           left: 2150,
           width: 100,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(200,200,0)',
           opacity: 1,
           track: 2,
           pulsate: false,
       },

       {
           left: 2375,
           width: 125,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(80,140,230)',
           opacity: 1,
           track: 3,
           pulsate: false,
       },

       // screen 4
       {
           left: 2633,
           width: 100,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(200,200,0)',
           opacity: 1,
           track: 1,
           pulsate: false,
       },

       {
           left: 2850,
           width: 100,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(150,190,225)',
           opacity: 1,
           track: 2,
           pulsate: false,
       },

       {
           left: 3075,
           width: 125,
           height: PLATFORM_HEIGHT,
           fillStyle: 'rgb(250,0,0)',
           opacity: 1,
           track: 3,
           pulsate: false,
       },

       {
          left: 3308,
          width: 100,
          height: PLATFORM_HEIGHT,
          fillStyle: 'rgb(250,250,0)',
          opacity: 1,
          track: 1,
          pulsate: false,
       },
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
        window.requestAnimationFrame(animate);
    }

    function animate(now) {
       fps = calculateFps(now);
       draw();
       window.requestAnimationFrame(animate);
    }

    function calculateFps(now) {
       var fps = 1000 / (now - lastAnimationFrameTime);
       lastAnimationFrameTime = now;

       if (now - lastFpsUpdateTime > 1000) {
          lastFpsUpdateTime = now;
          fpsElement.innerHTML = fps.toFixed(1) + ' fps';
       }
       return fps;
    }

    function draw() {
       context.clearRect(0, 0, canvas.width, canvas.height); // clear previous frame
       setOffsets();
       drawBackground();
       drawPlatforms();
       drawRunner();
    }

    function setOffsets() {
       setBackgroundOffset();
    }

    function setBackgroundOffset() {
       var offset = backgroundOffset + (bgVelocity / fps);

       if (offset > 0 && offset < background.width) {
            backgroundOffset = offset;
       }
       else {
          backgroundOffset = 0;
       }
    }

    function drawBackground() {

       context.translate(-backgroundOffset, 0);

       context.drawImage(background, 0, 0);

       context.drawImage(background, background.width, 0);
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

       if (track === 1) {top = TRACK_1_BASELINE;}
       else if (track === 2) {top = TRACK_2_BASELINE;}
       else if (track === 3) {top = TRACK_3_BASELINE;}

       return top - PLATFORM_HEIGHT;
    }

    function drawRunner() {
       context.drawImage(runner,
          STARTING_RUNNER_LEFT,
          calculatePlatformTop(STARTING_RUNNER_TRACK) - runner.height);

    }