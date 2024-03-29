
var bullets;
var asteroids;
var ship;
var lives = 0;
var shipImage, bulletImage, particleImage;
var shipSpeed = 100;
var slowDown = false;
var MARGIN = 40;

function setup() {
  createCanvas(800,600);

  bulletImage = loadImage('assets/asteroids_bullet.png');
  shipImage = loadImage('assets/asteroids_ship0001.png');
  particleImage = loadImage('assets/asteroids_particle.png');

  ship = createSprite(width/2, height/2);
  ship.maxSpeed = 6;
  ship.friction = 0.98;
  ship.setCollider('circle', 0, 0, 20);

  ship.addImage('normal', shipImage);
  ship.addAnimation('thrust', 'assets/asteroids_ship0002.png', 'assets/asteroids_ship0007.png');

  asteroids = new Group();
  bullets = new Group();

  for(var i = 0; i<8; i++) {
    var ang = random(360);
    var px = width/2 + 1000 * cos(radians(ang));
    var py = height/2+ 1000 * sin(radians(ang));
    createAsteroid(3, px, py);
  }
}

function draw() {
  background(0);

  fill(255);
  textSize(Math.sqrt(width));
  textAlign(CENTER);
  text('Controls: Arrow Keys + X', width/2, 30);
  //text(asteroids.length, width/2, height/2);

  if(shipSpeed < 0){
      slowDown = false;
      shipSpeed = 100;
  }
  //ship.addSpeed(shipSpeed, ship.rotation);

    if(ship.position.x<-MARGIN) ship.position.x = width+MARGIN;
    if(ship.position.x>width+MARGIN) ship.position.x = -MARGIN;
    if(ship.position.y<-MARGIN) ship.position.y = height+MARGIN;
    if(ship.position.y>height+MARGIN) ship.position.y = -MARGIN;

  for(var i=0; i<asteroids.length; i++) {
    var s = asteroids[i];
    if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
    if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
    if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
    if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

  asteroids.overlap(bullets, asteroidHit);

  ship.bounce(asteroids, loseLife);

  if(keyDown(LEFT_ARROW))
    ship.rotation -= 4;
  if(keyDown(RIGHT_ARROW))
    ship.rotation += 4;
  if(keyDown(UP_ARROW))
  {
    slowDown = false;
    //shipSpeed = 100;
    ship.addSpeed(100, ship.rotation);
    ship.changeAnimation('thrust');
  }
  else
    ship.changeAnimation('normal');

  if(keyWentUp(UP_ARROW)){
      slowDown = true;
  }

  if(slowDown){
      shipSpeed--;
      ship.addSpeed(shipSpeed, ship.rotation);
  }

  if(keyWentDown('x'))
  {
    var bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
    bullet.life = 50;
    bullets.add(bullet);
  }

  if(asteroids.length <= 0){
      text("YOU WIN", width/2, height/2);
  }else{
      text("Crashes:" + lives, width/2, height/2);
  }

  drawSprites();
}

function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img = loadImage('assets/asteroid'+floor(random(0, 3))+'.png');
  a.addImage(img);
  a.setSpeed(2.5-(type/2), random(360));
  a.rotationSpeed = 0.5;
  //a.debug = true;
  a.type = type;

  if(type == 2)
    a.scale = 0.6;
  if(type == 1)
    a.scale = 0.3;

  a.mass = 2+a.scale;
  a.setCollider('circle', 0, 0, 50);
  asteroids.add(a);
  return a;
}

function asteroidHit(asteroid, bullet) {
  var newType = asteroid.type-1;

  if(newType>0) {
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  }

  for(var i=0; i<10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(particleImage);
    p.setSpeed(random(3, 5), random(360));
    p.friction = 0.95;
    p.life = 15;
  }

    bullet.remove();
    asteroids.remove(asteroid);
    asteroid.remove();
}

function loseLife(){
  lives++;

  ship.position.x = width/2;
  ship.position.y = height/2;
}
