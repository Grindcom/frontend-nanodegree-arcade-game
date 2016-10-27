// TODO: Add score in top right
// TODO: Add enemy drop down column at random points feature
// TODO: Add shake block feature
// TODO: Review projet rubric and compare with progress



/**********************************
//
// Globals from engine.js
//
************************************/
// Set the lane height for the game

var LANEHEIGHT = 83;
// Set the row height for the game
var COLUMNWIDTH = 101;
// Total lanes including danger and safe, set by engine.js
var totalLanes = 1;
// Total columns, set by engin.js
var totalColumns = 0;
//
var ENEMY_LANE_MIN = 0;
var ENEMY_LANE_MAX = 3;

/**********************************
//
// Local Globals
//
************************************/
//
// Visible Game area limits
//
var BOTTOMWALL = 490;
var RIGHTWALL = 600;
//
// Column center X values
//  These values correspond to the player x value
//  that puts the player icon in the center of a column
var COLUMN_CENTERS = [0,100,200,300,400];
//
// Number of enemies on current level
//
var ENEMY_TOTAL = 4;
//
// Enemy speed
//
var enemySpeed = 1;
//
// Score of game
//
var gameScore = 0;
//
// Lives at start of game
//
var LIVES = 3;
//
// Enemy lanes
//
var ENEMY_LANE_MIN = 1;
var ENEMY_LANE_MAX = 3;
//
// Player start position
//
var PLAYER_START_X = 200;
var PLAYER_START_Y = 450;
//
// Random postion generator
//
function randPos(){
    var rnd = Math.floor(Math.random() * 100);
    return rnd + 100;
};
/*************************************************
//
//      LANE CLASS
//
***************************************************/
var Lane = function(t,b){
    this.id = 0;
    this.topY = t;
    this.bottomY = b;
    this.track = ((b+t)/2) + 12;// set to middle of lane
    this.safetyZone = "unknown";

};

/**************************************************
//
//      REWARD CLASS
//
***************************************************/
var Gem = function(){
    this.sprite = 'images/Rock.png';
    this.x = 0;
    this.y = 0;
    this.currentLane = null;// Lane to place gem into
    this.upScore = 0;// Amount to multiply player score by.
    this.hide = false;
    this.lastTime = 0;
};
//
Gem.prototype.update = function(dt){
    var tmp = dt*1000;
    if(this.lastTime > 0){
        var timeInterval = 20;
        // if hidden, show again after a time interval
        if(this.hide && (tmp - this.lastTime) > timeInterval){
            // set a random location
            this.randLoc();
            // Make visible.
            this.hide = false;
            // Record the time to compare later.
            this.lastTime = dt;
        }
    }else{
        this.lastTime = tmp;
    }
};
//
Gem.prototype.render = function() {
    if(!this.hide){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};
//
Gem.prototype.randLoc = function(){
    // Set to a random Lane
    this.currentLane = getRandLane(0,gameLanes.length - 1);
    this.y = gameLanes[this.currentLane].track;
    // set to a random column
    var tmp = getRandLane(0,COLUMN_CENTERS.length -1);
    this.x = COLUMN_CENTERS[tmp];
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
    this.sprite = 'images/enemy-bug-2.png';
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
    //
    // Check to see if enemy has hit the wall
    if(this.x >= RIGHTWALL){
        // TODO:  Set up a random delay before starting again
        // Move back to start
        this.x = 1 - randPos();
        // console.log(this.x);
        // Increase the speed
        enemySpeed = (enemySpeed+1) * dt;
        // Change lane at random
        this.setLane(getRandLane(ENEMY_LANE_MIN,ENEMY_LANE_MAX));
    } else {
        this.x = ++this.x;
        // console.log(enemySpeed);
        checkCollisions();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    showLife();
    // console.log("Enemy render...");
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Change lanes
Enemy.prototype.setLane = function(lane){
    // if lane is in range
    if(lane <= ENEMY_LANE_MAX && lane >= ENEMY_LANE_MIN){
        // set new currentLane
        this.currentLane = lane;
    }
    // set new y value
    this.y = gameLanes[lane].track;
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
    this.sprite = 'images/char-boy-2.png';
    // Initial x location for player
    this.x = PLAYER_START_X;
    // Initial y location for player
    this.y = PLAYER_START_Y;
    // Lane the player is in
    this.currentLane = 5;
};
//
Player.prototype.update = function(dt){

};
//
Player.prototype.render = function(){
    // If there are LIVES left, render the player icon.
    if(LIVES > 0){
        //
        // If player is in the score lane
        //  move towards the score box
        if(this.currentLane == 0){
            if(this.x >= RIGHTWALL){
                // Go back to start
                this.startPosition();
            }else{
                // keep moving towards score box
                this.x++;
            }
        }
        //
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};
// Re-locate Player to default position
Player.prototype.startPosition = function(){
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    this.currentLane = 5;
    // make sure input is accepted.
    ignoreInput = false;
};
// Interpret user input
var ignoreInput = false;
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
        if(this.y > 50){
            // decrement y
            this.y -= advanceFactor;
        }
        // If the current lane becomes zero, the Score increases
        if(this.currentLane == 0){
            // Increase the score
            gameScore++;
            // Send score to canvas
            setScore(gameScore);
            // Ignore input (until player.startPosition is called)
            ignoreInput = true;
            // Otherwise, Compare the current position with the next lanes tracke
        }else if(this.y < gameLanes[this.currentLane-1].track){
            // If player is past the next lanes center track move to the next lane.
            this.currentLane--;
        }
        break;
        case 'right':
        // If not all the way right
        if(this.x < (RIGHTWALL - 186)){
            // Increment x
            this.x += advanceFactor;
        }
        break;
        case 'down':
        // If not at bottom
        if(this.y < BOTTOMWALL){
            // Increment y
            this.y += advanceFactor;
        }else{// Otherwise assume player is at the bottom and bounce the icon back.
            // bounce back
            this.y = (BOTTOMWALL - 100);
            // TODO:  call for a flip of icon
        }
        // Make sure the current lane is within the gameLanes array size
        if(this.currentLane >= gameLanes.length){
            this.currentLane--;
            // Check for lane change
        }else if(this.y > gameLanes[this.currentLane].track){
            // If player is past the next lanes center track move to the next lane.
            this.currentLane++;
        }
        break;
        case 'jump':
        this.y -= 100;
        break;
        default:
        console.log("Not valid input");
    }
};

/**************************************************
//
//      APP OPERATIONS
//
***************************************************/
var gems = [];
function initGems(){
    // set up Blue Gem
    gems[0] = new Gem();
    gems[0].sprite = 'images/Gem Blue-2.png';
    gems[0].randLoc();
    gems[0].upScore = 10;
    // Set up Green Gem
    gems[1] = new Gem();
    gems[1].sprite = 'images/Gem Green-2.png';
    gems[1].randLoc();
    gems[1].upScore = 15;
    // Set up Orange Gem
    gems[2] = new Gem();
    gems[2].sprite = 'images/Gem Orange-2.png';
    gems[2].randLoc();
    gems[2].upScore = 20;
    // set up Rock
    gems[3] = new Gem();
    gems[3].sprite = 'images/Rock-2.png';
    gems[3].randLoc();
    gems[3].upScore = 0;//

};


// Now instantiate your objects.
var gameLanes = [];
function initLanes(){
    var i = 0;
    // initialize score lane
    gameLanes[i] = new Lane((i*LANEHEIGHT),(i*LANEHEIGHT)+LANEHEIGHT);
    gameLanes[i].safetyZone = "score";
    gameLanes[i].id = i;
    //
    // Set up enemy lanes
    //
    for(i = 1; i <= 3/*number of danger lanes*/;i++){
        gameLanes[i] = new Lane((i*LANEHEIGHT),(i*LANEHEIGHT)+LANEHEIGHT);
        gameLanes[i].safetyZone = "danger";
        gameLanes[i].id = i;
    }
    //
    // Set up the safe lanes
    //
    for(; i < totalLanes; i++){
        gameLanes[i] = new Lane((i*LANEHEIGHT),(i*LANEHEIGHT)+LANEHEIGHT);
        gameLanes[i].safetyZone = "safe";
        gameLanes[i].id = i;
    }
};
//
// Place all enemy objects in an array called allEnemies
//
var allEnemies = [];
function initEnemies(){
    for(var i = 0; i < ENEMY_TOTAL /*number of enemies*/; i++){
        // Select one of the danger lanes at random
        var selectedLane = getRandomIntInclusive(ENEMY_LANE_MIN,ENEMY_LANE_MAX);
        // Make a new enemy object
        allEnemies[i] = new Enemy();
        // Place the enemy in a lane
        allEnemies[i].y = gameLanes[selectedLane].track;//i*90 + 50;
        // Randomly place the enemy on the x axis
        allEnemies[i].x = randPos()*i;
        // Store the lane this enemy will be in
        allEnemies[i].currentLane = selectedLane;
    }
};
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
    if(!ignoreInput){
        player.handleInput(allowedKeys[e.keyCode]);
    }

});

/***************************************************************
//
//       SCOREBOARD FUNCTIONS
//
***************************************************************/
//
// Set the score
//
function setScore(newScore){
    // Clear canvas so score text is clean
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "right";
    // Set the outside text and location
    ctx.strokeText(newScore,canvas.width - 20, 35);
    // set the fill text and location
    ctx.fillText(newScore,canvas.width - 20, 35);
};

//
// Show LIVES remaining
//
function showLife(){
    var i;
    for(i = 0; i < LIVES; i++){
        ctx.drawImage(Resources.get('images/Heart-2-tiny.png'), i*25, 0);
    }
    //
};

//
/***************************************************************
//
//       OTHER HELPER FUNCTIONS
//
***************************************************************/
//
// Pick a random lane between the given parameters
//  ( expect low is less than high)
//
function getRandLane(low,high){
    var maxLanes = (gameLanes.length)-1;
    var newLane = getRandomIntInclusive(low,high);
    return newLane;
};
//
// Check for player v. obstacle collisions
//
function checkCollisions(){
    // Make sure test is within array bounds
    //  if current lane is same as game lane size
    if( player.currentLane >= gameLanes.length ){
        // Do nothing
        return;
    }
    // Check wheter player is in a danger Zone
    if(gameLanes[player.currentLane].safetyZone == "danger"){
        // Compare player position with enemies that are in the same lane
        allEnemies.forEach(function(enemy){
            // If the enemy and player are in the same lane
            if(enemy.currentLane == player.currentLane){
                // set a range where player is killed
                var low = enemy.x - 75;
                var high = enemy.x + 75;
                // compare the players x position with the kill zone
                if(player.x > low && player.x < high){
                    // If in the kill zone send back to start
                    player.startPosition();
                    LIVES--;
                    if(!LIVES){
                        // Send game over message with score
                        setScore("Game Over!  Your Score: " + gameScore)
                        //
                        return;
                    }
                    // Clear canvas so score text is clean
                    // ctx.clearRect(0, 0, canvas.width, canvas.height);
                    setScore(gameScore);
                    //
                    return;
                }
            }
        });
    }
    //
    // Check for collisions with gems
    //  Bugs make gems hide and a player
    //  collision affects score.
    gems.forEach(function(gem){
        var low = gem.x - 75;
        var high = gem.x + 75;
        // If the gem isn't hidden see if
        //  it is in a collision zone.
        if(!gem.hide){
            // Check against player first
            //  Are they in the same lane?
            if(gem.currentLane == player.currentLane){
                if(player.x > low && player.x < high){
                    // Make sure score can increase if possible
                    if(gameScore <= 0){
                        gameScore = 1;
                    }
                    // multiply current score by the gems bonus amount
                    gameScore = gameScore * gem.upScore;
                    setScore(gameScore);
                    // Hide this gem,
                    gem.hide = true;
                }
            }
            // Check against all Bugs
            //
            allEnemies.forEach(function(enemy){
                // Are they in the same lane?
                if(gem.currentLane == enemy.currentLane){
                    // if they are in same square
                    if(enemy.x > low && enemy.x < high){
                        // Hide the gem.
                        gem.hide = true;
                    }
                }
            });

        }

    });
};
/***************************************************************
//
//       STARTUP AND INIT FUNCTIONS
//
***************************************************************/
//
// Function to set up Meme text style
//
function initText (context){
    // Set font size and type
    context.font = "36px Impact";
    context.textAlign = 'center';
    // Set outline color
    context.strokeStyle = "black";// this is the default color
    // Set fill color
    context.fillStyle = "white";// this is the default color
    // Set the stroke width
    context.lineWidth = 3;
    // Show initial score
    setScore(gameScore);
};
//
// When this page is loaded initialize the required variables
//  and arrays
//
window.onload = function(){
    //
    initLives();
    // Initialize the score text
    initText(ctx);
    // Initialize the game score
    gameScore = 0;
    // Initialize lanes
    initLanes();
    // Initizlize the enemies array
    initEnemies();
    // Init Gems array
    initGems();

};
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
};
