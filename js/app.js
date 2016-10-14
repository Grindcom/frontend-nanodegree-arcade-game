// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = 0;
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
        // Move back to start
        this.x = 0.1;
    } else {
        this.x = ++this.x + (this.x*dt);
    }

    console.log("Enemy x: " + this.x);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // console.log("Enemy render...");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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
    switch (key) {
        case 'left':
        // console.log("left");
        // If not all the way left
        if(this.x > 0){
            // decrement x
            this.x--;
        }
        break;
        case 'up':
        // If not all the way up
        if(this.y > 0){
            // decrement y
            this.y--;
        }
        break;
        case 'right':
        // var tmp = this.x;
        // console.log("Right, canvas width: " + tmp);
        // If not all the way right
        if(this.x < (rightWall - 186)){
            // Increment x
            this.x++;
        }
        break;
        case 'down':
        // var tmp = this.y;
        // console.log("down: " + tmp);
        // If not at bottom
        if(this.y < bottomWall){
            // Increment y
            this.y++;
        }else{
            // bounce back
            this.y = (bottomWall - 100);
            //Todo: call for a flip
        }
        break;
        case 'jump':
        this.x += 100;
        break;
        default:
        console.log("nothing: " + key);
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for(var i = 0; i < 3 /*number of enemies*/; i++){
    allEnemies[i] = new Enemy();
    allEnemies[i].y = i*90 + 50;
    allEnemies[i].x = 1;
    console.log("allEnemies length: " + allEnemies.length + ", y:" + allEnemies[i].y);
}
// Place the player object in a variable called player
var player = new Player();
//
// Visible Game area limits
//
var bottomWall = 445;
var rightWall = 505;

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
