/**********************************
//
// Globals from engine.js
//
************************************/
// Set the lane height for the game
var laneHeight = 83;
// Set the row height for the game
var columnWidth = 101;

/**********************************
//
// Local Globals
//
************************************/
//
// Visible Game area limits
//
var bottomWall = 445;
var rightWall = 505;
//
// Number of enemies on current level
//
var enemyTotal = 3;
//
// Enemy speed
//
var enemySpeed = 1;
//
// Random postion generator
//
function randPos(){
    var rnd = Math.floor(Math.random() * 100);
    return rnd + 100;
}
/*************************************************
//
//      LANE CLASS
//
***************************************************/
var Lane = function(t,b){
    this.topY = t;
    this.bottomY = b;
    this.track = ((b+t)/2)+15;
    this.safetyZone = "unknown";
};

/**************************************************
//
//      ENEMY CLASS
//
***************************************************/
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = 0;
    this.currentLane = null;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // console.log("Enemy Update: " + dt);
    // Check to see if enemy has hit the wall
    if(this.x >= rightWall){
        // Todo: Set up a random delay before starting again
        // Move back to start
        this.x = 1 - randPos();
        // console.log(this.x);
        // Increase the speed
        enemySpeed = (enemySpeed+1) * dt;
        // Change lane at random
        var tmp = (dangerLane.length)-1;
        console.log("tmp: " + tmp);
        var newLane = getRandomIntInclusive(0,tmp);
        console.log(newLane);
        this.setLane(newLane);
    } else {
        this.x = ++this.x;
        // console.log(enemySpeed);
    }

    // console.log("Enemy x: " + this.x);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // console.log("Enemy render...");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Change lanes
Enemy.prototype.setLane = function(lane){
    // is lane in range
    if(lane < dangerLane.length){
        // set new currentLane
        this.currentLane = lane;
    }
    // set new y value
    this.y = dangerLane[lane].track;
};
/**************************************************
//
//      PLAYER CLASS
//
***************************************************/
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    // Initilize icon for player
    this.sprite = 'images/char-boy.png';
    // Initial x location for player
    this.x = 200;
    // Initial y location for player
    this.y = 400;
};
//
Player.prototype.update = function(dt){
    // console.log("Player update: " + dt);
};
//
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//
Player.prototype.handleInput = function(key){
    var advanceFactor = 10;
    switch (key) {
        case 'left':
        // If not all the way left
        if(this.x > 0){
            // decrement x
            this.x -= advanceFactor;
        }
        break;
        case 'up':
        // If not all the way up
        if(this.y > -10){
            // decrement y
            this.y -= advanceFactor;
        }
        break;
        case 'right':
        // var tmp = this.x;
        // console.log("Right, canvas width: " + tmp);
        // If not all the way right
        if(this.x < (rightWall - 186)){
            // Increment x
            this.x += advanceFactor;
        }
        break;
        case 'down':
        // var tmp = this.y;
        // console.log("down: " + tmp);
        // If not at bottom
        if(this.y < bottomWall){
            // Increment y
            this.y += advanceFactor;
        }else{
            // bounce back
            this.y = (bottomWall - 100);
            //Todo: call for a flip
        }
        break;
        case 'jump':
        this.y -= 100;
        break;
        default:
        console.log("nothing");
    }
};

/**************************************************
//
//      APP OPERATIONS
//
***************************************************/
// Now instantiate your objects.
//
// Set up enemy lanes
//
var dangerLane = [];
for(var i = 0; i < 3/*number of danger lanes*/;i++){
    dangerLane[i] = new Lane((i*laneHeight),(i*laneHeight)+laneHeight);
    dangerLane[i].safetyZone = "danger";
    console.log(dangerLane[i].track);
}
//
// Place all enemy objects in an array called allEnemies
//
var allEnemies = [];
for(var i = 0; i < enemyTotal /*number of enemies*/; i++){
    // Select one of the danger lanes at random
    var selectedLane = getRandomIntInclusive(0,2);
    console.log(selectedLane);
    // Make a new enemy object
    allEnemies[i] = new Enemy();
    // Place the enemy in a lane
    allEnemies[i].y = dangerLane[selectedLane].track;//i*90 + 50;
    // Randomly place the enemy on the x axis
    allEnemies[i].x = randPos()*i;
    // Store the lane this enemy will be in
    allEnemies[i].currentLane = selectedLane;
}
//
// Place the player object in a variable called player
//
var player = new Player();
//



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        74: 'jump'
    };
    // Use this to find any key code
    // console.log("Key Listener: " + e.keyCode);
    // Call for an action
    player.handleInput(allowedKeys[e.keyCode]);
});

/***************************************************************
//
//       BORROWED FUNCTIONS
//
***************************************************************/
// This random generator function can be found at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
