// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    console.log("requestAnimFrame");
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var wallStyle = "../assets/wall.png";


///////////////////

// Get the canvas and then the context
var canvas = document.getElementById("appCanvas");
var ctx = canvas.getContext("2d");


///////////////////


// Define our global vars
var CONST = {
    MOVE_SPEED: 5.0, // The player's movement speed, in pixels
    cat_SPEED: 2.0,
    NUM_groupOfCats: 2,
    MOUSE_SPEED: 2.0,
    NUM_MICE: 6
}; // For constants, vars that never change

var player;
var groupOfCats = [];// new Array();
var mice = [];
var lastTime; // Used for deltaTime
var score = 0; // Num eaten groupOfCats
var gameOver = false;
// A simple object for a wall, just holds properties
var wall = {
    x: 200,
    y: 100,
    width: 50,
    height:300,

    
}

random = Math.random()* 1000;
random2 = Math.random()* 550;

cheeseItem = {
    x: random,
    y: random2,
    width: 32,
    height:32,                                                                                                   
}

// var walls = new Array();
// walls.push({
//     x: 200,
//     y: 100,
//     width: 50,
//     height:300,
//     color: "#000000"
// });

// walls.push({
//     x: 400,
//     y: 100,
//     width: 50,
//     height:300,
//     color: "#000000"
// });

// Variables to hold whether keys are pressed or not
// true means down.
// [Up, Right, Down, Left] 
var dirKeysDown = [false, false, false, false];
// Define the array indexes for dirKeysDown
// for easy reference ltter
CONST.KEY = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};
var spaceKeyDown = false;

///////////////////


// Load assets

var animalSpriteSheet = new Image();
var cheese = new Image();
cheese.onload = function() {
    // Setup the game    
    init()
}
animalSpriteSheet.onload = function() {
    cheese.src = 'assets/I_C_Cheese.png';
};
animalSpriteSheet.src = 'assets/animalSpriteSheet2x.png';

///////////////////

// Setup the game and start the main loop
function init() {

    player = new Player(animalSpriteSheet, 0, 0, 64, 64);

    for(var c=0; c<CONST.NUM_groupOfCats; c++) {
        groupOfCats[c] = new cat(animalSpriteSheet);
        groupOfCats[c].x = canvas.width/3; // ------spawn location
        groupOfCats[c].y = canvas.height/3;
    }

    for(var m=0; m<CONST.NUM_MICE; m++) {
        mice[m] = new Mouse(animalSpriteSheet);
        mice[m].x = canvas.width/2;
        mice[m].y = canvas.height/2;
    }


    // Define immediately before calling main
    lastTime = Date.now();
    mainLoop(); // Start the game
}

///////////////////

// The main loop, this gets called every anim frame
function mainLoop(currentTime) {
    // Keep track of delta time (dt)
    // dt is the time elapsed between frames
    currentTime = Date.now();
    var dt = (currentTime - lastTime) / 1000.0;
    
    
    update(dt);

    render();   
   

    // Update the lastTime to the current time
    lastTime = currentTime;
    // Call main again (forever!)
    if(!gameOver){
        requestAnimFrame(mainLoop);
    }

}



// Make all draw calls within this func.
// Don't need to pass ctx here because its in scope for this func (global)
function render() {
    // Clear our canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawCheckerboard();

    // Render groupOfCats underneath cat (in terms of layers)
    for(var c=0; c<CONST.NUM_groupOfCats; c++) {
        groupOfCats[c].render(ctx);
    }

    for(var m=0; m<CONST.NUM_MICE; m++) {
        mice[m].render(ctx);
    }
    // Render a wall
    ctx.save(); // Save context just incase, good habit incase we do some transforms
    var img = document.getElementById("lamp")
    var pat = ctx.createPattern(img, "repeat");
    ctx.fillStyle = pat;
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    
    ctx.fill();
    ctx.restore();

    ctx.save(); // Save context just incase, good habit incase we do some transforms
    ctx.drawImage(
            cheese,
            // image file
            0,
            0,
            cheeseItem.width,
            cheeseItem.height,
            // canvas
            cheeseItem.x,
            cheeseItem.y,
            cheeseItem.width,
            cheeseItem.height);   
    ctx.restore();

    // Render all sprites and any other draw functions
    player.render(ctx);

}
// draw canvas and border with colors
function drawCheckerboard() {
    ctx.save();

    ctx.strokeStyle = "#888";
    ctx.strokeRect(0,0,canvas.width,canvas.height)

    ctx.restore();
}


// Update values and state changes in here
function update(dt) {

    // Update sprites and other values here
   
    /////////////////////////////
    // Update player

    var newPlayerX = player.x;
    var newPlayerY = player.y;
    
    var maxX = canvas.width - player.width;
    var maxY = canvas.height - player.height;

    // Note: y increases downward, so to
    // move up we reduce the y
    if(dirKeysDown[CONST.KEY.UP]) {
        newPlayerY -= CONST.MOVE_SPEED;
        if(newPlayerY < 0)
            newPlayerY = 0;

         player.dir = player.facing.up;
    } 

    if(dirKeysDown[CONST.KEY.DOWN]) {
        newPlayerY += CONST.MOVE_SPEED;
        // Want to make sure player doesn't go off screen
        // so adjust for dimensions

        if(newPlayerY > maxY)
            newPlayerY = maxY;

         player.dir = player.facing.down;
    }

    if(dirKeysDown[CONST.KEY.RIGHT]) {
        newPlayerX += CONST.MOVE_SPEED;
        // Want to make sure player doesn't go off screen
        // so adjust for dimensions
        if(newPlayerX > maxX)
            newPlayerX = maxX;

         player.dir = player.facing.right;
    }

    if(dirKeysDown[CONST.KEY.LEFT]) {
        newPlayerX -= CONST.MOVE_SPEED;

        if(newPlayerX < 0)
            newPlayerX = 0;

        player.dir = player.facing.left;
    }

    // Now we check to see if the player is moving or now
    // and set the idle and new positions

    if(Utils.intersects(newPlayerX, newPlayerY, player.width, player.height, wall.x, wall.y, wall.width, wall.height)) {
        // Reset new position so player doesn't move (they can't move into a wall)
        newPlayerX = player.x;
        newPlayerY = player.y;
    }

    if(player.x == newPlayerX && player.y ==  newPlayerY ) {
        player.idle = true;
    } else {


        player.idle = false;
        player.x = newPlayerX;
        player.y = newPlayerY;
    }

    player.update(dt);


    /////////////////////////////
    // Update groupOfCats

    var newcatX, newcatY;
    for(var c=0; c<CONST.NUM_groupOfCats; c++) {

        // Get the initial position for this updates
        newcatX = groupOfCats[c].x;
        newcatY = groupOfCats[c].y;

        // We want to figure out if the cat is 
        // going to move in a new direction first
        groupOfCats[c].updateDirection(dt);

        // Then we increment in that direction
        if(groupOfCats[c].dir == 0) { // Down (+y)
            newcatY += CONST.cat_SPEED;
        } else if(groupOfCats[c].dir == 1) { // Left (-x)
            newcatX -= CONST.cat_SPEED;
        } else if(groupOfCats[c].dir == 2) { // Right (+x)
            newcatX += CONST.cat_SPEED;
        } else if(groupOfCats[c].dir == 3) { // Up (-y)
            newcatY -= CONST.cat_SPEED;
        }

        // And just before updating the sprite, we
        // make sure the cat didn't go off screen...        
        // Do some boundary checks incase
        // update put the cat out of bounds.
        // NOTE: We couldn't do this inside the cat obj without having to pass boundaries to the cat.
        if(newcatX <= 0)
            newcatX = 0;
        else if(newcatX >= maxX) // The maxX for player and cat are equal, they have same size sprites
            newcatX = maxX;

        if(newcatY <= 0)
            newcatY = 0;
        else if(newcatY >= maxY) // The maxY for player and cat are equal, they have same size sprites
            newcatY = maxY;

        // Prevent cat from walking through wall
        if(Utils.intersects(newcatX, newcatY, groupOfCats[c].width, groupOfCats[c].height, wall.x, wall.y, wall.width, wall.height)) {
            // Reset new position so cat doesn't move (they can't move into a wall)
            newcatX = groupOfCats[c].x;
            newcatY = groupOfCats[c].y;
        } else {
            groupOfCats[c].x = newcatX;
            groupOfCats[c].y = newcatY;
        }

        // Finally do the actual update.
        groupOfCats[c].update(dt);

        // If cat and cat are colliding, cat dead.
        if(groupOfCats[c].intersectsWith(player.x, player.y, player.width, player.height)) {
            // Deleted all inside, and removed alive stuff
            playerDied();

        } else if(player.intersectsWith(cheeseItem.x, cheeseItem.y, cheeseItem.width, cheeseItem.height)) {

            gotCheese();
        }

    }

    var newMouseX, newMouseY;
    for(var m=0; m<CONST.NUM_MICE; m++) {

        // Get the initial position for this updates
        newMouseX = mice[m].x;
        newMouseY = mice[m].y;

        // We want to figure out if the mouse is 
        // going to move in a new direction first
        mice[m].updateDirection(dt);

        // Then we increment in that direction
        if(mice[m].dir == 0) { // Down (+y)
            newMouseY += CONST.MOUSE_SPEED;
        } else if(mice[m].dir == 1) { // Left (-x)
            newMouseX -= CONST.MOUSE_SPEED;
        } else if(mice[m].dir == 2) { // Right (+x)
            newMouseX += CONST.MOUSE_SPEED;
        } else if(mice[m].dir == 3) { // Up (-y)
            newMouseY -= CONST.MOUSE_SPEED;
        }

        // And just before updating the sprite, we
        // make sure the mouse didn't go off screen...        
        // Do some boundary checks incase
        // update put the mouse out of bounds.
        // NOTE: We couldn't do this inside the mouse obj without having to pass boundaries to the mouse.
        if(newMouseX <= 0)
            newMouseX = 0;
        else if(newMouseX >= maxX) // The maxX for player and mouse are equal, they have same size sprites
            newMouseX = maxX;

        if(newMouseY <= 0)
            newMouseY = 0;
        else if(newMouseY >= maxY) // The maxY for player and mouse are equal, they have same size sprites
            newMouseY = maxY;

        // Prevent mouse from walking through wall
        if(Utils.intersects(newMouseX, newMouseY, mice[m].width, mice[m].height, wall.x, wall.y, wall.width, wall.height)) {
            // Reset new position so mouse doesn't move (they can't move into a wall)
            newMouseX = mice[m].x;
            newMouseY = mice[m].y;
        } else {
            mice[m].x = newMouseX;
            mice[m].y = newMouseY;
        }

        // Finally do the actual update.
        mice[m].update(dt);

        // If mouse and cat are colliding, mouse dead.
        if(mice[m].alive && mice[m].intersectsWith(player.x, player.y, player.width, player.height)) {
            mice[m].alive = false;
            updateScore();
        }
    }

}


// If the score gets updated
function updateScore() {
    score++;
    $('.score').html(score);
    // Check if game ended?
    if(score == CONST.NUM_MICE) {
        // Player finished the game
        //$('.gameOverSuccess').show();

        $('.gameOverSuccess').html("You Win").addClass('reveal');
        gameOver = true;  
    }
}

function playerDied() {
    $('.gameOverSuccess').html("Try Again").addClass('reveal'); 
    gameOver = true;  
}

function gotCheese() {
    // $('.gameOverSuccess').html("Cheesed").addClass('reveal').css("color","green");  
     // gameOver = false; 
    currentTime = Date.now();
    
    random = Math.random()* 1000;
    random2 = Math.random()* 550;
    if (currentTime == currentTime) {
        cheeseItem = {
            x: random,
            y: random2,
            width: 32,
            height:32
        }
    };
    lastTime = Date.now();
    console.log(currentTime)
    console.log(lastTime)
}


document.addEventListener('keydown', function(e) {
    var code = e.keyCode;
   
    switch(code) {   
        case 32: // Space
            spaceKeyDown = true;
            break;

        case 37: // Left
            dirKeysDown[CONST.KEY.LEFT] = true;           
            break;
        case 38: // Up
            dirKeysDown[CONST.KEY.UP] = true;
            break;
        case 39: // Right
             dirKeysDown[CONST.KEY.RIGHT] = true;            
            break;
        case 40: // Down
            dirKeysDown[CONST.KEY.DOWN] = true;          
            break;

        default: // Do nothing

        // NOTE: To track keyboard letters, you can use
        // the following and check the letters...
        // convert ASCII codes to letters:
        // var letter = String.fromCharCode(code);
           
    }
});

document.addEventListener('keyup', function(e) {
    var code = e.keyCode;
   
    switch(code) {   
        case 32: // Space
            spaceKeyDown = false;
            break;

        case 37: // Left
            dirKeysDown[CONST.KEY.LEFT] = false;           
            break;
        case 38: // Up
            dirKeysDown[CONST.KEY.UP] = false;
            break;
        case 39: // Right
             dirKeysDown[CONST.KEY.RIGHT] = false;            
            break;
        case 40: // Down
            dirKeysDown[CONST.KEY.DOWN] = false;          
            break;

        default: // Do nothing.
    }
});



