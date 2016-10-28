# Arcage Game
## Getting Started
Before you can play you have to download the related files and folders from the repository (`https://github.com/Grindcom/frontend-nanodegree-arcade-game`), place them in a local folder.
Make sure you have them all.  
1. `README.md`  
2. `index.html`  
3. css (folder)  
4. images (folder)  
5. js (folder)  
You can name your local folder anything, but the above file structure must remain the same.  
Once you have the files downloaded, open the `index.html` file in any browser.  The game will start automatically.  

## Game Play
Use the arrow keys to move the player icon around the board.
## Scoring
Get the player icon to the top lane (water) to get a point.  Get a gem for bonus points.  Get a rock and loose all your points.
## Lives
Player starts with 3 lives. If the player hits a bug or is run over by one, they loose a life (heart).
## Restart
To restart the game, refresh the browser.

## Deep Dive into the Code
Enemies start at random x locations as well as in random danger lanes (the cobble blocks). When the enemy finishes their track, they start again in a different, randomly selected track.
Global variables for lane height and column width allow changes to the view of the game.  These are currently added to app.js  
## Code objects
There are three objects for the app.  They all have two functions in common, although those are not necessarily implemented the same for each. Objects are drawn by calles from the engine.js file; 'renderEntities()' and 'updateEntities(dt)'.  The initializers for all the objects are all called from the 'window.onload' function.
Below are the most important aspects of these objects. (unless otherwise noted, the referenced functions are found in app.js)

### In Common variables
1. All objects have a 'currentLane' variable which is used for collision detection.
2. 'x' and 'y' location variables which are bounded by '0' and 'rightWall' for 'x' and '0'and 'bottomWall' for 'y'.  
3. Each object has a 'sprite', which is the png icon for the object.  In the case of gems there is a different icon for each type.

### Enemy
1. An array of Enemies is created in the 'initEnemies' function.  The number of enemies in the array is set with the 'enemyTotal' variable.
2. Enemies are restricted to only 3 lanes using the enemy objects' 'setLane(lane)' function, the 'getRandLane(low,high)' is used to randomly select a lane from the possible choices, which is then set as a parameter for setLane.  The range of enemy lanes is set with two variables 'enemyLaneMin' and 'enemyLaneMax'.

### Player
1. The player is created with a call to `var player = new Player()`
2. The players 'render()' function checks that the player has lives left and, if so, checks if the player is in the score lane ('currentLane'==0) before drawing the icon.  If the player is in the score lane, the icon floats to the right until it disappears, then it re-appears at the start again; using the objects 'startPosition()' function.
3. The Players 'handleInput()' function is called from the event listener that is set up in 'document.addEventListener(...)'.  The arrow keys are given variable names and used in a switch statement in 'handleInput()'.

### Gem
1. The 'gems' array holds all the gems (one is a rock).  This array is initialized in 'initGems()'.
2. After the initial rendering a gem in the 'gems' array will be hidden if it has been overrun by a player or bug.  A gem that is hidden will reappear, in a random place - set by a call to 'Gem.prototype.randLoc'.  The rapearance time is set in the 'Gem.prototype.update' function.
3. Gems are randomly placed in any lane or column.

### Lane
1. The 'gameLanes' array is initialized by 'initLanes()'.
2. Lanes can be of three types, 'safe', 'danger' and 'score'; indicated by the variable 'Lanes.safetyZone'.
3. Lanes have an 'Lanes.id' variable that corresponds the their array position.  This can be used to compare the current lane position.

### Helper functions
1. `setScore(newScore)` Display the 'newScore'.
2. `showLife()` Show the life hearts.
3. `getRandLane(low,high)` Return a random integer between the low and high integers.
4. `checkCollisions()`  Check for collisions between bug and player, bug and gem, player and gem.


## This is now a Fork of Udacity's arcade game
frontend-nanodegree-arcade-game
===============================

Students should use this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) for self-checking their submission. Make sure the functions you write are **object-oriented** - either class functions (like Player and Enemy) or class prototype functions such as Enemy.prototype.checkCollisions, and that the keyword 'this' is used appropriately within your class and class prototype functions to refer to the object the function is called upon. Also be sure that the **readme.md** file is updated with your instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).
