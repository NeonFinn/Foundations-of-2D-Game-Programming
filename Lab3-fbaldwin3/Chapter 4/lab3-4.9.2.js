var SnailBait = function () {
   var snailBait = this;
   snailBait.canvas = document.getElementById('game-canvas'),
   snailBait.context = snailBait.canvas.getContext('2d'),
   snailBait.fpsElement = document.getElementById('fps'),

   // Constants.........................................................

   snailBait.LEFT = 1,
   snailBait.RIGHT = 2,

   snailBait.TRANSPARENT = 0,
   snailBait.OPAQUE = 1.0,

   snailBait.BACKGROUND_VELOCITY = 42,

   snailBait.PLATFORM_HEIGHT = 8,
   snailBait.PLATFORM_STROKE_WIDTH = 2,
   snailBait.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',

   snailBait.RUNNER_LEFT = 50,
   snailBait.STARTING_RUNNER_TRACK = 1,

   // Track baselines...................................................

   snailBait.TRACK_1_BASELINE = 323,
   snailBait.TRACK_2_BASELINE = 223,
   snailBait.TRACK_3_BASELINE = 123,

   // Platform scrolling offset (and therefore speed) is
   // PLATFORM_VELOCITY_MULTIPLIER * backgroundOffset: The
   // platforms move PLATFORM_VELOCITY_MULTIPLIER times as
   // fast as the background.

   snailBait.PLATFORM_VELOCITY_MULTIPLIER = 4.35,

   snailBait.STARTING_BACKGROUND_VELOCITY = 0,

   snailBait.STARTING_PLATFORM_OFFSET = 0,
   snailBait.STARTING_BACKGROUND_OFFSET = 0,

   // States............................................................

   snailBait.paused = false;
   snailBait.PAUSED_CHECK_INTERVAL = 200;
   snailBait.windowHasFocus = true;
   snailBait.countdownInProgress = false;

   // Images............................................................

   snailBait.background  = new Image(),
   snailBait.runnerImage = new Image(),

   // Time..............................................................

   snailBait.lastAnimationFrameTime = 0,
   snailBait.lastFpsUpdateTime = 0,
   snailBait.fps = 60,

   snailBait.fpsElement = document.getElementById('fps'),

   // Toast.............................................................

   snailBait.toastElement = document.getElementById('toast'),

   // Runner track......................................................

   snailBait.runnerTrack = snailBait.STARTING_RUNNER_TRACK,

   // Translation offsets...............................................

   snailBait.backgroundOffset = snailBait.STARTING_BACKGROUND_OFFSET,
   snailBait.platformOffset = snailBait.STARTING_PLATFORM_OFFSET,

   // Velocities........................................................

   snailBait.bgVelocity = snailBait.STARTING_BACKGROUND_VELOCITY,
   snailBait.platformVelocity,

   // Platforms.........................................................

   snailBait.platformData = [
      // Screen 1.......................................................
      {
         left:      10,
         width:     230,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      {  left:      250,
         width:     100,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(150,190,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      633,
         width:     100,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 2.......................................................

      {  left:      810,
         width:     100,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1025,
         width:     100,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     125,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Screen 3.......................................................

      {  left:      1625,
         width:     100,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     100,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,80)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      2100,
         width:     100,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
      },


      // Screen 4.......................................................

      {  left:      2269,
         width:     200,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
      },

      {  left:      2500,
         width:     200,
         height:    snailBait.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         snail:     true
      },
   ];
};

SnailBait.prototype = {
   draw: function (now) {
      this.setPlatformVelocity();
      this.setOffsets(now);

      this.drawBackground();
      this.drawRunner();
      this.drawPlatforms();
   },

   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * this.PLATFORM_VELOCITY_MULTIPLIER;
   },

   setOffsets: function (now) {
      this.setBackgroundOffset(now);
      this.setPlatformOffset(now);
   },

   setBackgroundOffset: function (now) {
      this.backgroundOffset += this.bgVelocity * (now - this.lastAnimationFrameTime) / 1000;

      if (this.backgroundOffset < 0 || this.backgroundOffset > this.background.width) {
         this.backgroundOffset = 0;
      }
   },

   setPlatformOffset: function (now) {
      this.platformOffset += this.platformVelocity * (now - this.lastAnimationFrameTime) / 1000;

      if (this.platformOffset > 2 * this.background.width) {
         this.turnLeft();
      } else if (this.platformOffset < 0) {
         this.turnRight();
      }
   },

   drawBackground: function () {
      this.context.translate(-this.backgroundOffset, 0);

      this.context.drawImage(this.background, 0, 0);
      this.context.drawImage(this.background, this.background.width, 0);

      this.context.translate(this.backgroundOffset, 0);
   },

   drawRunner: function () {
      this.context.drawImage(
         this.runnerImage,
         this.RUNNER_LEFT,
         this.calculatePlatformTop(this.runnerTrack) - this.runnerImage.height
      );
   },

   drawPlatform: function (data) {
      var platformTop = this.calculatePlatformTop(data.track);

      this.context.lineWidth = this.PLATFORM_STROKE_WIDTH;
      this.context.strokeStyle = this.PLATFORM_STROKE_STYLE;
      this.context.fillStyle = data.fillStyle;
      this.context.globalAlpha = data.opacity;

      this.context.strokeRect(data.left, platformTop, data.width, data.height);
      this.context.fillRect(data.left, platformTop, data.width, data.height);
   },

   drawPlatforms: function () {
      this.context.translate(-this.platformOffset, 0);

      for (var i = 0; i < this.platformData.length; i++) {
         this.drawPlatform(this.platformData[i]);
      }

      this.context.translate(this.platformOffset, 0);
   },

   calculateFps: function (now) {
      var fps = 1 / (now - this.lastAnimationFrameTime) * 1000;

      if (now - this.lastFpsUpdateTime > 1000) {
         this.lastFpsUpdateTime = now;
         this.fpsElement.innerHTML = fps.toFixed(0) + ' fps';
      }
      return fps;
   },

   calculatePlatformTop: function (track) {
      if (track === 1) return this.TRACK_1_BASELINE;
      if (track === 2) return this.TRACK_2_BASELINE;
      if (track === 3) return this.TRACK_3_BASELINE;
   },

   turnLeft: function () {
      this.bgVelocity = -this.BACKGROUND_VELOCITY;
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
   },

   revealToast: function (text, duration) {
      var self = this;
      var DEFAULT_TOAST_DISPLAY_DURATION = 1000;
      duration = duration || DEFAULT_TOAST_DISPLAY_DURATION;

      this.toastElement.style.display = 'block';
      this.toastElement.innerHTML = text;

      setTimeout(function () {
         if (self.windowHasFocus) {
            self.toastElement.style.display = 'none';
         }
      }, duration);
   },

   animate: function (now) {
      var self = this;
      if (this.paused) {
         setTimeout(function () {
            requestNextAnimationFrame(self.animate.bind(self));
         }, this.PAUSED_CHECK_INTERVAL);
      } else {
         this.fps = this.calculateFps(now);
         this.draw(now);
         this.lastAnimationFrameTime = now;
         requestNextAnimationFrame(this.animate.bind(this));
      }
   },

   togglePaused: function () {
      var now = +new Date();

      this.paused = !this.paused;

      if (this.paused) {
         this.pauseStartTime = now;
      } else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }
   },

   initializeImages: function () {
      var self = this;

      this.background.src = 'images/background.png';
      this.runnerImage.src = 'images/runner.png';

      this.background.onload = function () {
         self.startGame();
      };
   },

   startGame: function () {
      requestNextAnimationFrame(this.animate.bind(this));
   }
};

// Event handlers.......................................................

window.addEventListener('keydown', function (e) {
   var key = e.keyCode;

   if (key === 68 || key === 37) { // 'd' or left arrow
      snailBait.turnLeft();
   }
   else if (key === 75 || key === 39) { // 'k' or right arrow
      snailBait.turnRight();
   }
   else if (key === 80) { // 'p'
      snailBait.togglePaused();
   }
});

window.addEventListener('blur', function (e) {
   snailBait.windowHasFocus = false;

   if ( ! snailBait.paused) {
     snailBait.togglePaused();
   }
});

window.addEventListener('focus', function (e) {
   var originalFont = snailBait.toastElement.style.fontSize,
       DIGIT_DISPLAY_DURATION = 1000; // milliseconds

   snailBait.windowHasFocus = true;
   snailBait.countdownInProgress = true;

   if (snailBait.paused) {
      snailBait.toastElement.style.font = '128px fantasy'; // Large font

      if (snailBait.windowHasFocus && snailBait.countdownInProgress)
         snailBait.revealToast('3', 1000); // Display 3 for 1.0 seconds

      setTimeout(function (e) {
         if (snailBait.windowHasFocus && snailBait.countdownInProgress)
            snailBait.revealToast('2', 1000); // Display 2 for 1.0 seconds

         setTimeout(function (e) {
            if (snailBait.windowHasFocus && snailBait.countdownInProgress)
               snailBait.revealToast('1', 1000); // Display 1 for 1.0 seconds

            setTimeout(function (e) {
               if ( snailBait.windowHasFocus && snailBait.countdownInProgress)
                  snailBait.togglePaused();

               if ( snailBait.windowHasFocus && snailBait.countdownInProgress)
                  snailBait.toastElement.style.fontSize = originalFont;

               snailBait.countdownInProgress = false;

            }, DIGIT_DISPLAY_DURATION);

         }, DIGIT_DISPLAY_DURATION);

      }, DIGIT_DISPLAY_DURATION);
   }
});

// Launch game.........................................................

var snailBait = new SnailBait();

snailBait.initializeImages();

