var balls = [],
  needUpdateBallsArray;
var fire, nbBalls, maxBalls;
var gunx, guny, gunvx, reload, shipHeight, shipWidth;
var img, img1, img2, img3, img4, img5;
var stars = [];
var emojis = [];
var maxEmojis = 30;
var score;
var lives;
var retry, retryTimer, life, info;
//***************************************************
function preload() {
  img = loadImage('assets/ship.png');
  img1 = loadImage("assets/alien.png");
  img2 = loadImage("assets/alien2.png");
  img3 = loadImage("assets/alien3.png");
  img4 = loadImage("assets/evil.png");
  img5 = loadImage("assets/bomb.png");
}
//***************************************************
function setup() {
  createCanvas(windowWidth, windowHeight);
  initEmojis();
  nbBalls = 0;
  maxBalls = 50;
  needUpdateBalls = false;
  gunx = windowWidth / 2;
  guny = windowHeight / 1.1;
  shipHeight = 72;
  shipWidth = 50;
  gunvx = 0;
  fire = false;
  reload = 0;
  score = 0;
  retry = false;
  info = true;
  lives = 3;
  for (var i = 0; i < 1000; i++) {
    stars[i] = new Star();
    stars[i].init();
    posx = windowWidth / 2;
    posy = windowHeight / 2;
    taille = 100;
    vx = random(-1, 1);
    vy = random(-1, 1);
    speed = 5;
  }
}
/******************************************************************************/
function initEmojis() {
  for (var i = 0; i < maxEmojis; i++) {
    createEmoji(i);
  }
}

function createEmoji(i) {
  var alea = random(0, 100);
  var img;
  if (alea < 30) {
    typeEmoji = 1;
  } else if (alea < 60) {
    typeEmoji = 2;
  } else if (alea < 90) {
    typeEmoji = 3;
  } else if (alea < 95) {
    typeEmoji = 4;
  } else {
    typeEmoji = 5;
  }

  emojis[i] = new Emoji(typeEmoji);
  emojis[i].init();
}
//***************************************************
function draw() {
  background(0);

  for (var i = 0; i < nbBalls; i++) {
    balls[i].drawBall();
  }

  if (fire && reload === 0) {
    balls[nbBalls] = new Ball();
    nbBalls++;
    reload = 15;
  }
  //drawStar();
  for (var i = 0; i < 1000; i++) {
    stars[i].drawStar();
  }

  drawGun();
  deadHit();

  if (reload > 0) {
    reload--;
  }
  fire = keyIsDown(32);

  if (needUpdateBallsArray) {
    updateBallsArray()
  }

  drawEmoji();
  for (var i = 0; i < maxEmojis; i++) {
    emojis[i].drawEmoji();
  }
  textSize(25);
  fill(255);
  text("Help: Down arrow key ", 10, 25);

  textSize(25);
  fill(255);
  text("Score: " + score, 10, 50);

  textSize(25);
  fill(255);
  text("Lives: " + lives, 10, 75);


  if (retry === true) {
    Retry();
    retryTimer--;
  }
  if (info === true) {
    Info();
  }

}

function Info() {
  textSize(20);
  fill(255);
  text("Move: Left & Right Arrow Keys", 200, 500);
  text("Stop: Up Arrow Key", 200, 525);
  text("Shoot: Space Bar", 200, 550);
}
//***************************************************
function drawGun() {
  image(img, gunx, guny, shipWidth, shipHeight);
  gunx += gunvx
  if (gunx < 0) {
    gunx = windowWidth;
  }
  if (gunx > windowWidth) {
    gunx = 0;

  }
}

function deadHit() {
  for (var i = 0; i < maxEmojis; i++) {
    if (dist(gunx, guny, emojis[i].posx, emojis[i].posy) < 25) {
      fill('red');
      ellipse(gunx + 25, guny + 35, 80, 80);
      fill('orange');
      ellipse(gunx + 25, guny + 35, 60, 60);
      fill('yellow');
      ellipse(gunx + 25, guny + 35, 40, 40);
      lives -= 1;
      if (lives === 2) {
        initEmojis();
      }
      if (lives === 1) {
        initEmojis();
      }

      if (lives === 0) {
        retry = true;
      }
      createEmoji(i);
    }
  }
}
//***************************************************
function Ball() {
  this.posx = gunx + 10;
  this.posy = windowHeight - 70;
  this.couleur = color(255, 255, 255);
  this.vy = -10;
  this.taille = 4;
  this.life = windowHeight / 10;
  this.maxlife = this.life;

  this.drawBall = function() {
    if (this.life > 0) {
      strokeWeight(4);
      noFill();
      stroke(this.couleur);
      line(this.posx, this.posy - 10, this.posx, this.posy - 2);
      this.update();
      line(this.posx + 29, this.posy + 8, this.posx + 29, this.posy + 2);
      this.update();
    }
  }
  this.update = function() {
    if (this.posy < 0) {
      this.life = 0;
      needUpdateBallsArray = true;
    }
    this.testHit();
    this.posy += this.vy;
    this.life--;
    this.couleur = color(255, 255 * this.life / this.maxlife, 255 * this.life / this.maxlife);
  }


  this.testHit = function() {
      for (var i = 0; i < maxEmojis; i++) {
        if (dist(this.posx, this.posy, emojis[i].posx, emojis[i].posy) < 25) {

          if (emojis[i].type < 4) {
            fill('red');
            ellipse(emojis[i].posx + 12, emojis[i].posy + 15, 25, 25);
            fill('yellow');
            ellipse(emojis[i].posx + 12, emojis[i].posy + 15, 15, 15);
            score += 5;
          } else {
            typeEmoji = 4;
            fill('red');
            ellipse(emojis[i].posx + 12, emojis[i].posy + 15, 25, 25);
            fill('yellow');
            ellipse(emojis[i].posx + 12, emojis[i].posy + 15, 15, 15);
            score += 10;

          }
          createEmoji(i);
          this.life = 0;
          needUpdateBallsArray = true;
        }

      }
    }
    /*var alea = random(0, 100);
    var typeEmoji;
    if (alea < 30) {
      typeEmoji = 1;
    } else if (alea < 60) {
      typeEmoji = 3;
    } else if (alea < 90) {
      typeEmoji = 4;
    } else if (alea < 95) {
      typeEmoji = 2;
    } else {
      typeEmoji = 5;
    }*/

}
//***************************************************
function updateBallsArray() {
  for (var i = 1; i < nbBalls; i++) {
    balls[i - 1] = balls[i];
  }
  nbBalls--;
  needUpdateBallsArray = false;
}
//***************************************************
function Star() {
  this.posy = random(0, windowHeight);
  this.couleur = color(255);
  this.vx = 0;
  this.vy = 1;

  this.init = function() {
    this.posx = random(0, windowWidth);
    this.taille = random(2);
    this.speed = random(0.5, 1);
  }

  this.drawStar = function() {
    noStroke();
    fill(this.couleur);
    ellipse(this.posx, this.posy, this.taille);
    this.update();
  }
  this.update = function() {
    if (this.posy > windowHeight) {
      this.posy = 0;
      this.init();
    }
    this.posx += this.vx * this.speed;
    this.posy += this.vy * this.speed;
  }
}
//***************************************************
function drawStar() {
  //fill(255, 0, 0);
  strokeWeight(3);
}
//***************************************************
function Emoji(typeEmoji) {
  this.posy = random(-windowHeight, 0);
  this.couleur = color(255);
  this.vx = 0;
  this.vy = 1;
  this.type = typeEmoji;

  switch (typeEmoji) {
    case 1:
      this.img = img1;
      this.speed = 1;
      break;
    case 2:
      this.img = img2;
      this.speed = 0.8;
      break;
    case 3:
      this.img = img3;
      this.speed = 1;
      break;
    case 4:
      this.img = img4;
      this.speed = 1;
      break;
    case 5:
      this.img = img5;
      this.speed = 2;
      break;
  }


  this.init = function() {
    this.posx = random(0, windowWidth);
    this.taillex = 25;
    this.tailley = 25;
    //this.speed = random(0.5,2);
  }

  this.drawEmoji = function() {
    fill(this.couleur);
    image(this.img, this.posx, this.posy, this.taillex, this.tailley);
    this.update();
  }
  this.update = function() {
    if (this.posy > windowHeight) {
      this.posy = random(-500, 0);
      this.init();
      score -= 20;
    }
    this.posx += this.vx * this.speed;
    this.posy += this.vy * this.speed;
  }
}
//***************************************************
function drawEmoji() {
  //fill(255, 0, 0);
  strokeWeight(3);
}
//***************************************************
function keyPressed() {
  switch (keyCode) {
    case 37:
      gunvx = -3;
      info = false;
      break;
    case 39:
      gunvx = +3;
      info = false;
      break;
    case 38:
      gunvx = 0;
      info = false;
      break;
    case 40:
      info = true;
      break;
    default:
      info = false;
      break;
  }
}
//***************************************************
function keyReleased() {
  fire = false;
}

function Retry() {
  background('black');
  textSize(100);
  fill(0, 102, 153);
  fill(255);
  textFont("impact");
  textAlign(CENTER);
  text("TRY AGAIN", windowWidth / 2, windowHeight / 2);
  posI = 1;
  posJ = 1;
}
//***************************************************
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  guny = windowHeight / 1.1;
}
//***************************************************