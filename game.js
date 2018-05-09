
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.atlas('breakout', 'breakout/breakout.png', 'breakout/breakout.json');
    game.load.image('starfield', 'star-field-2294797_960_720.jpg');
    game.load.image('life', 'assets/games/starstruck/star2.png');
    for(var n = 0; n<6; n++) {
        game.load.image('brick' + n + '', 'breakout/brick' + n + '.png');
    }
    game.load.image('asteroid','assets/games/asteroids/asteroid1.png');
    game.load.spritesheet('kaboom', 'assets/games/invaders/explode.png', 128, 128);
    game.load.image('explodingBall', 'assets/games/orbit/powerup_ball.png');
    game.load.image('doubleBall','assets/games/orbit/powerup_multiball.png');
    game.load.image('stickyPaddle','assets/games/orbit/powerup_s.png');
    game.load.audio('explode','assets/audio/SoundEffects/explosion.mp3');
    game.load.audio('pickup','assets/audio/SoundEffects/pickup.wav');
    game.load.audio('break','assets/audio/SoundEffects/shot2.wav');
    game.load.audio('death','assets/audio/SoundEffects/player_death.wav');
    game.load.audio('life','assets/audio/SoundEffects/p-ping.mp3');

}

var ball;
var ball2 = null;
var paddle;
var bricks;
var life;

var ballOnPaddle = true;

var lives = 3;
var lifeTimer;
var score = 0;

var scoreText;
var livesText;
var introText = '-Click to Start-';
var timeText;
var time = 0;
var gameOverText;
var currLevel = 1;

var asteroid;
var asteroidTimer=2000;

var explosions;

var explodingBall;
var poweredUp = false;

var explosionSound;
var pickupSound;
var breakSound;
var deathSound;
var lifeSound;

var doubleBall;
var numBalls = 1;
var doubledUp = false;

var stickyPaddle;
var stickyPaddleTimer= 0;
var stickiedUp = false;

var powerUpText = 'Powered Up!';

var s;

var levelVelY = -300;
var levelVelX = -75;

var fallingTimer = 0;
var fallingTimer2 = 500;
var start = false;
var down = false;




function create() {


    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

    s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;
    paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
    paddle.anchor.setTo(0.5, 0.5);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
    ball.anchor.set(0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    ball.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);

    ball.events.onOutOfBounds.add(ballLost, this);


    var brick;

    if (currLevel === 0) {
        levelVelY = -300;
        levelVelX = -80;
        for (y = 0; y < 3; y++) {
            for (var x = 0; x < 4; x++) {
                brick = bricks.create(120 + (x * 32), 100 + (y * 52), 'brick' + y + '');
                brick.body.bounce.set(1);
                brick.body.immovable = true;
            }
        }
    }
    //brick sizes are 32x16
    if (currLevel === 2) {
        levelVelY = -400;
        levelVelX = -80;
        for (var y = 0; y < 10; y++) {
            brick = bricks.create(120 + (y * 32), 100 + (y * 20), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (var y = 0; y < 10; y++) {
            brick = bricks.create(410 + (y * 32), 280 - (y * 20), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (var y = 0; y < 10; y++) {
            brick = bricks.create(120 + (y * 32), 80 + (y * 20), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (var y = 0; y < 10; y++) {
            brick = bricks.create(410 + (y * 32), 260 - (y * 20), 'brick' + y % 3 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (var y = 0; y < 10; y++) {
            brick = bricks.create(120 + (y * 32), 60 + (y * 20), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (var y = 0; y < 10; y++) {
            brick = bricks.create(410 + (y * 32), 240 - (y * 20), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }

    }
    else if (currLevel === 1) {
        for (y = 0; y < 4; y++) {
            for (var x = 0; x < 10; x++) {
                brick = bricks.create(120 + (x * 32), 100 + (y * 52), 'brick' + y + '');
                brick.body.bounce.set(1);
                brick.body.immovable = true;
            }
        }
    }
    else if (currLevel === 3) {
        levelVelY = -500;
        levelVelX = -80;
        for (y = 0; y < 8; y++) {
            brick = bricks.create(300 + (y * 32), 400, 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 8; y++) {
            brick = bricks.create(300 + (y * 32), 250, 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 8; y++) {
            brick = bricks.create(300 + (y * 32), 100, 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 7; y++) {
            brick = bricks.create(300, 100 + (y * 32), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 6; y++) {
            brick = bricks.create(300, 250 + (y * 32), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }
    else if (currLevel === 4) {
        levelVelY = -600;
        levelVelX = -80;
        for (y = 0; y < 14; y++) {
            brick = bricks.create(120 + (y * 32), 50, 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 14; y++) {
            brick = bricks.create(120 + (y * 32), 65, 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 15; y++) {
            brick = bricks.create(313, 80 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 15; y++) {
            brick = bricks.create(345, 80 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }
    else if (currLevel === 5) {
        levelVelY = -700;
        levelVelX = -80;
        brick = bricks.create(400, 100, 'brick5');
        brick.body.bounce.set(1);
        brick.body.immovable = true;
        brick = bricks.create(400, 340, 'brick4');
        brick.body.bounce.set(1);
        brick.body.immovable = true;
        for (y = 0; y < 8; y++) {
            brick = bricks.create(375 - (y * 25), 115 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 8; y++) {
            brick = bricks.create(425 + (y * 25), 115 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 8; y++) {
            brick = bricks.create(600 - (y * 25), 220 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 8; y++) {
            brick = bricks.create(200 + (y * 25), 220 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        brick = bricks.create(400, 130, 'brick5');
        brick.body.bounce.set(1);
        brick.body.immovable = true;
        brick = bricks.create(400, 370, 'brick4');
        brick.body.bounce.set(1);
        brick.body.immovable = true;
        for (y = 0; y < 8; y++) {
            brick = bricks.create(375 - (y * 25), 145 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 8; y++) {
            brick = bricks.create(425 + (y * 25), 145 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 8; y++) {
            brick = bricks.create(600 - (y * 25), 250 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 8; y++) {
            brick = bricks.create(200 + (y * 25), 250 + (y * 15), 'brick' + y % 6 + '');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
        for (y = 0; y < 4; y++) {
            for (x = 0; x < 4; x++) {
                brick = bricks.create(355 + (y * 30), 220 + (x * 15), 'brick' + (y + 2));
                brick.body.bounce.set(1);
                brick.body.immovable = true;
            }
        }
        for (y = 3; y >= 0; y--) {
            for (x = 3; x >= 0; x--) {
                brick = bricks.create(355 + (y * 30), 220 + (x * 15), 'brick' + (y));
                brick.body.bounce.set(1);
                brick.body.immovable = true;
            }
        }
    }
    else if (currLevel === "gameOver") {
        gameOverText = game.add.text(400, 200, '-Game Over!-\nYour Score: '+score+'\nYour time: '+Math.floor(time / 60)+' Seconds\n-Click to Restart-', {font: "30px Arial", fill: "#ffffff", align: "center"});
        gameOverText.anchor.setTo(0.5, 0.5);



    }
    else if(currLevel === "won"){
        gameOverText = game.add.text(400, 200, '-You Won!--\nYour Score: '+score+'\nYour time: '+Math.floor(time / 60)+' Seconds\n-Click to Restart-', {font: "30px Arial", fill: "#ffffff", align: "center"});
        gameOverText.anchor.setTo(0.5, 0.5);
    }



    var randomNumForTime = (Math.random() * 500) + 300;
    lifeTimer = time + randomNumForTime;

    lifeS = game.add.group();
    lifeS.enableBody = true;
    lifeS.physicsBodyType = Phaser.Physics.ARCADE;
    lifeS.createMultiple(2, 'life');
    lifeS.setAll('anchor.x', 0.5);
    lifeS.setAll('anchor.y', 1);
    lifeS.setAll('outOfBoundsKill', true);
    lifeS.setAll('checkWorldBounds', true);


    asteroids = game.add.group();
    asteroids.enableBody = true;
    asteroids.physicsBodyType = Phaser.Physics.ARCADE;
    asteroids.createMultiple(30, 'asteroid');
    asteroids.setAll('anchor.x', 0.5);
    asteroids.setAll('anchor.y', 1);
    asteroids.setAll('outOfBoundsKill', true);
    asteroids.setAll('checkWorldBounds', true);

    explodingBalls = game.add.group();
    explodingBalls.enableBody = true;
    explodingBalls.physicsBodyType = Phaser.Physics.ARCADE;
    explodingBalls.createMultiple(2, 'explodingBall');
    explodingBalls.setAll('anchor.x', 0.5);
    explodingBalls.setAll('anchor.y', 1);
    explodingBalls.setAll('outOfBoundsKill', true);
    explodingBalls.setAll('checkWorldBounds', true);
    explosionSound = game.add.audio('explode');
    pickupSound = game.add.audio('pickup');
    breakSound = game.add.audio('break');
    deathSound = game.add.audio('death');
    lifeSound = game.add.audio('life');



    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupExplosion, this);

    doubleBalls = game.add.group();
    doubleBalls.enableBody = true;
    doubleBalls.physicsBodyType = Phaser.Physics.ARCADE;
    doubleBalls.createMultiple(2, 'doubleBall');
    doubleBalls.setAll('anchor.x', 0.5);
    doubleBalls.setAll('anchor.y', 1);
    doubleBalls.setAll('outOfBoundsKill', true);
    doubleBalls.setAll('checkWorldBounds', true);

    stickyPaddles = game.add.group();
    stickyPaddles.enableBody = true;
    stickyPaddles.physicsBodyType = Phaser.Physics.ARCADE;
    stickyPaddles.createMultiple(2, 'stickyPaddle');
    stickyPaddles.setAll('anchor.x', 0.5);
    stickyPaddles.setAll('anchor.y', 1);
    stickyPaddles.setAll('outOfBoundsKill', true);
    stickyPaddles.setAll('checkWorldBounds', true);

    scoreText = game.add.text(32, 550, 'score: ' + score, {font: "20px Arial", fill: "#ffffff", align: "left"});
    livesText = game.add.text(680, 550, 'lives: ' + lives, {font: "20px Arial", fill: "#ffffff", align: "left"});
    introText = game.add.text(game.world.centerX, 400, introText, {
        font: "40px Arial",
        fill: "#ffffff",
        align: "center"
    });

    introText.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(releaseBall, this);

    timeText = game.add.text(250, 0, 'Time: ' + Math.floor(time / 60), {
        font: "20px Arial",
        fill: "#ffffff",
        align: "left"
    });

    powerUpText = game.add.text(400, 350, powerUpText, {font: "30px Arial", fill: "#ffffff", align: "left"});
    powerUpText.visible = false;


}

function dropPowerup() {
    var randomNum = Math.floor(Math.random() * 4);
    console.log(randomNum);
    if(randomNum=== 0 ) {
        dropLife();
    }
    else if(randomNum === 1 ) {
        dropDoubleBall();
    }
    else if(randomNum===2 ) {
        dropStickyPaddle();
    }
    else if(randomNum===3 ) {
        dropExplodingBall();
    }

}

function dropLife() {
    var randomNum = Math.random() * 500;
    life = lifeS.getFirstExists(false);
    if(life != null) {
        life.reset(randomNum, 0);
        game.physics.arcade.moveToXY(life,0,1500,120);
    }



}
function dropExplodingBall() {
    var randomNum = Math.random() * 500;
    explodingBall = explodingBalls.getFirstExists(false);
    if(explodingBall != null) {
        explodingBall.reset(randomNum, 0);
        game.physics.arcade.moveToXY(explodingBall, 0, 1500, 120);
    }
}

function dropDoubleBall() {
    var randomNum = Math.random() * 500;
    doubleBall = doubleBalls.getFirstExists(false);
    if(doubleBall != null)
    {
        doubleBall.reset(randomNum, 0);
        game.physics.arcade.moveToXY(doubleBall, 0, 1500, 120);
    }
}

function dropStickyPaddle() {
    var randomNum = Math.random() * 500;
    stickyPaddle = stickyPaddles.getFirstExists(false);
    if(stickyPaddle!= null) {
        stickyPaddle.reset(randomNum, 0);
        game.physics.arcade.moveToXY(stickyPaddle, 0, 1500, 120);
    }
}

function dropAsteroid(){
    asteroidTimer=0;
    var randomNum = Math.random() * 500;

    asteroid = asteroids.getFirstExists(false);

    asteroid.reset(randomNum, 0);

    game.physics.arcade.moveToObject(asteroid,paddle,120);
}
function setupExplosion (brick) {

    brick.anchor.x = 0.5;
    brick.anchor.y = 0.5;
    brick.animations.add('kaboom');

}
function descendBricks(){
    var numAlive = bricks.countLiving();
    console.log("k:" + numAlive);
    var current = bricks.getFirstAlive();

    for (var k = 0; k < numAlive; k++) {
        var pos = bricks.getIndex(current);
        if (current.alive) {
            current.reset(current.x, current.y + 34);
        }
        else {
            current = bricks.getChildAt(pos + 1);
        }

        current = bricks.getChildAt(pos + 1);

    }

}
function checkBrickLevel(_brick) {
    if(_brick.y >= paddle.y){
        gameOver();
    }
}

function updateTime() {
    time++;
    timeText.text = 'Time: ' + Math.floor(time/60);
}

function update () {
    if(currLevel === "gameOver" || currLevel === "won"){
        game.input.onDown.add(restartGame,this);
    }
    if(currLevel === 5){
        fallingTimer++;
    }
    if(stickiedUp === false && poweredUp === false){
        powerUpText.visible = false;
    }
    if(Math.floor(lifeTimer) === Math.floor(time)){
        dropPowerup();
        var randomNumForTime = (Math.random() * 500)+200;
        lifeTimer = time+randomNumForTime;
    }
    if(currLevel === 5 && Math.floor(fallingTimer) >=1000 && start === true) {
        fallingTimer2++;
        bricks.forEachAlive(checkBrickLevel,this);
    }
    if(currLevel === 5 && Math.floor(fallingTimer2) >= 500){
        descendBricks();
        fallingTimer2=0;
    }




    asteroidTimer++;
    if(bricks.countLiving() <= 5 && asteroidTimer >= 200) {
        dropAsteroid();

    }
    if(time===0){
        if(ballOnPaddle===false){
            setInterval(updateTime(),1000);
        }
    }
    else{
        setInterval(updateTime(),1000);
    }
    //setInterval(updateTime(),1000);
    //  Fun, but a little sea-sick inducing :) Uncomment if you like!
    // s.tilePosition.x += (game.input.speed.x / 2);

    paddle.x = game.input.x;

    if (paddle.x < 24)
    {
        paddle.x = 24;
    }
    else if (paddle.x > game.width - 24)
    {
        paddle.x = game.width - 24;
    }

    if (ballOnPaddle)
    {
        if(stickiedUp || doubledUp){
            game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
            game.physics.arcade.collide(ball2, paddle, ballHitPaddle, null, this);
            game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
            game.physics.arcade.collide(ball2, bricks, ballHitBrick, null, this);
            game.physics.arcade.collide(paddle, asteroids, asteroidsHitPaddle, null, this);
            game.physics.arcade.collide(paddle, explodingBalls, powerUpHitPaddle, null, this);
            game.physics.arcade.collide(paddle, doubleBalls, doubleBallHitPaddle, null, this);
            game.physics.arcade.collide(paddle, stickyPaddles, stickyPaddleHitPaddle, null, this);
            game.physics.arcade.collide(paddle,lifeS,lifeHitPaddle,null,this);
        }
        ball.body.x = paddle.x;
    }
    else
    {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball2, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
        game.physics.arcade.collide(ball2, bricks, ballHitBrick, null, this);
        game.physics.arcade.collide(paddle,lifeS,lifeHitPaddle,null,this);
        game.physics.arcade.collide(paddle, asteroids, asteroidsHitPaddle, null, this);
        game.physics.arcade.collide(paddle, explodingBalls, powerUpHitPaddle, null, this);
        game.physics.arcade.collide(paddle, doubleBalls, doubleBallHitPaddle, null, this);
        game.physics.arcade.collide(paddle, stickyPaddles, stickyPaddleHitPaddle, null, this);

    }

}

function releaseBall () {
    start = true;
    if (ballOnPaddle)
    {
        stickiedUp = false;
        ballOnPaddle = false;
        ball.body.velocity.y = levelVelY;
        ball.body.velocity.x = levelVelX;
        ball.animations.play('spin');
        introText.visible = false;
    }


}
function clear(lifeS,explodingBalls,stickyPaddles, doubleBalls) {
    poweredUp = false;
    stickiedUp = false;
    if(lifeS.getFirstAlive() != null) {
        lifeS.getFirstAlive().kill();
    }
    if(explodingBalls.getFirstAlive()!= null) {
        explodingBalls.getFirstAlive().kill();
    }
    if(doubleBalls.getFirstAlive()!= null) {
        doubleBalls.getFirstAlive().kill();
    }
    if(stickyPaddles.getFirstAlive()!= null) {
        stickyPaddles.getFirstAlive().kill();
    }
}
function ballLost () {
    if (!doubledUp) {
        deathSound.play();
        clear(lifeS, explodingBalls,stickyPaddles,doubleBalls);
        powerUpText.visible = false;
        lives--;
        livesText.text = 'lives: ' + lives;

        if (lives === 0) {
            gameOver();
        }
        else {
            ballOnPaddle = true;

            ball.reset(paddle.body.x + 16, paddle.y - 16);

            ball.animations.stop();
        }
        doubledUp=false;
    }
    else{doubledUp=false;}


}
function restartGame() {
    start = false;
    currLevel = 1;
    introText = '-Click to Start-';
    //introText.visible = true;

    ballOnPaddle = true;
    ball.body.velocity.set(0);
    ball.x = paddle.x + 16;
    ball.y = paddle.y - 16;
    ball.animations.stop();
    lives = 3;
    score = 0;
    time = 0;
    game.input.onDown.remove(restartGame,this);
    levelVelY = -300;
    levelVelX = -75;
    create();

}
function gameOver () {
    ballOnPaddle = true;
    ball.body.velocity.set(0);
    ball.x = paddle.x + 16;
    ball.y = paddle.y - 16;
    ball.animations.stop();
    currLevel="gameOver";
    create();

}
function explode(_object) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(_object.x,_object.y);
    explosion.play('kaboom', 30, false, true);
    explosionSound.play();
}
function asteroidsHitPaddle(paddle,_asteroid){
    clear(lifeS,explodingBalls,stickyPaddles,doubleBalls);
    _asteroid.kill();
    explode(paddle);
    explosionSound.play();
    ballLost();
}
function displayPoweredUp(){
    powerUpText.visible = true;
}

function powerUpHitPaddle(paddle, _explodingBall){
    pickupSound.play();
    score+=15;
    scoreText.text = 'score: ' + score;
    displayPoweredUp();
    //_explodingBall.revive();
    _explodingBall.destroy();
    poweredUp=true;

}
function doubleBallHitPaddle(paddle,_doubleBall){
    pickupSound.play();
    if(doubledUp === false) {
        doubledUp = true;
        score += 15;
        scoreText.text = 'score: ' + score;
        //_doubleBall.revive();
        _doubleBall.destroy();
        numBalls = 2;
        ball2 = game.add.sprite(ball.x, ball.y, 'breakout', 'ball_1.png');
        ball2.anchor.set(0.5);
        ball2.checkWorldBounds = true;

        game.physics.enable(ball2, Phaser.Physics.ARCADE);

        ball2.body.collideWorldBounds = true;
        ball2.body.bounce.set(1);

        ball2.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);

        ball2.events.onOutOfBounds.add(ballLost, this);

        ball2.body.velocity.y = levelVelY;
        ball2.body.velocity.x = levelVelX;
        ball2.animations.play('spin');
    }
    else{
        score += 15;
        scoreText.text = 'score: ' + score;
        //_doubleBall.revive();
        _doubleBall.destroy();
    }

}
function stickyPaddleHitPaddle(paddle, _stickyPaddle){
    pickupSound.play();
    score+=15;
    scoreText.text = 'score: ' + score;
    displayPoweredUp();
    //_stickyPaddle.revive();
    _stickyPaddle.destroy();
    stickiedUp = true;
}

function ballHitBrick (_ball, _brick) {
    var pos = bricks.getIndex(_brick);
    if (poweredUp === true) {
        explode(_brick);
        _brick.kill();
        if (bricks.getChildAt(pos + 1) != null) {
            explode(bricks.getChildAt(pos + 1));
            bricks.getChildAt(pos + 1).kill();
        }
        if (bricks.getChildAt(pos - 1) != null) {
            explode(bricks.getChildAt(pos - 1));
            bricks.getChildAt(pos - 1).kill();
        }
        if (bricks.getChildAt(pos + 1) != null && bricks.getChildAt(pos - 1) != null) {
            score += 30;

            scoreText.text = 'score: ' + score;
        }
        else {
            score += 20;

            scoreText.text = 'score: ' + score;
        }
    }
    else {
        breakSound.play();
        _brick.kill();
        score += 10;

        scoreText.text = 'score: ' + score;
    }


    //  Are there any bricks left?
    if (bricks.countLiving() == 0) {
        if (currLevel === 5) {
            currLevel = "won";
            create();
        }
        else {
            numBalls = 1;
            ball2 = null;
            //  New level starts
            score += 1000;
            scoreText.text = 'score: ' + score;
            introText = '- Next Level -';
            powerUpText = 'Powered Up!';
            start = false;

            //  Let's move the ball back to the paddle
            ballOnPaddle = true;
            ball.body.velocity.set(0);
            ball.x = paddle.x + 16;
            ball.y = paddle.y - 16;
            ball.animations.stop();

            currLevel++;
            create();
        }

    }
    poweredUp = false;
}

function ballHitPaddle (_ball, _paddle) {

    var diff = 0;
    if(stickiedUp === true){
        ballOnPaddle = true;
        ball.body.velocity.set(0);
        ball.animations.stop();
    }
    else {
        if (_ball.x < _paddle.x) {
            //  Ball is on the left-hand side of the paddle
            diff = _paddle.x - _ball.x;
            _ball.body.velocity.x = (-10 * diff);
        }
        else if (_ball.x > _paddle.x) {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x - _paddle.x;
            _ball.body.velocity.x = (10 * diff);
        }
        else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball.body.velocity.x = 2 + Math.random() * 8;
        }
    }

}
function lifeHitPaddle(paddle,_life){
    lifeSound.play();
    //_life.revive();
    lives++;
    livesText.text = 'lives: ' + lives;
    _life.destroy();

}