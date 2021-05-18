var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var Bground, invisibleGround, Bgroundimg;

var clouds, cloudImage;
var obstacle, obstacleimg, obstacleGroup;

var gameOverImg, restartImg;

function preload() {
  boy_running = loadAnimation("boy-running.png");
  boy_collided = loadAnimation("boy-felldown.png");

  Bgroundimg = loadImage("background.png");
  cloudImage = loadImage("cloud1.png");

  obstacleimg = loadImage("obstacle123.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
}

function setup() {
  createCanvas(530, 400);
  // console.log("hi")
  Bground = createSprite(600, 200, 600, 600);
  Bground.addImage("ground", Bgroundimg);
  Bground.x = Bground.width / 2;
  console.log(Bground.x);
  Bground.scale = 2;
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  boy = createSprite(50, 200, 20, 50);

  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);

  boy.scale = 1.5;

  obstacleGroup = new Group();

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(0, 390, 400, 10);
  invisibleGround.visible = false;
}

function draw() {
  background(255);

  boy.collide(invisibleGround);
  console.log(Bground.x);
  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //change the trex animation
    boy.changeAnimation("running", boy_running);

    Bground.velocityX = -4;

    if (Bground.x < 100) {
      Bground.x = Bground.width / 2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && boy.y >= 100) {
      boy.velocityY = -12;
    }

    //add gravity
    boy.velocityY = boy.velocityY + 0.8;

    //spawn the clouds
    // spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstacleGroup.isTouching(boy)) {
      boy.velocityY = -12;
      gameState = END;
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    boy.changeAnimation("collided", boy_collided);
    boy.scale = 0.3;

    Bground.velocityX = 0;
    boy.velocityY = 0;

    obstacleGroup.setLifetimeEach(-1);
    //clouds.setLifetimeEach(-1);

    obstacleGroup.setVelocityXEach(0);
    // clouds.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  boy.collide(invisibleGround);

  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    clouds = createSprite(600, 120, 40, 10);
    clouds.y = Math.round(random(80, 120));
    clouds.addImage(cloudImage);
    clouds.scale = 0.1;
    clouds.velocityX = -3;

    clouds.lifetime = 200;
  }
}

function spawnObstacles() {
  if (frameCount % 80 === 0) {
    obstacle = createSprite(600, 360, 10, 40);
    //obstacle.x = Math.round(random(80, 600));
    obstacle.addImage(obstacleimg);
    obstacle.scale = 0.15;
    obstacle.velocityX = -6;

    obstacle.lifetime = 200;
    obstacleGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  obstacle.destroy();
  clouds.destroy();
}
