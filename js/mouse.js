(function() {

    // spriteSheetImg - the image containing all the frames
    // xFrameRef - the column position starting at 0 in spritesheet where sprite frames start
    // yFrameRef - the row position starting at 0 in spritesheet where sprite frames start
    // mouseSpeed - how fast the mouse moves
    function Mouse(spriteSheetImg, xFrameRef, yFrameRef, mouseSpeed) {
       
        // Mouse's position
        this.x = 0;
        this.y = 0;

        this.xFrameRef = xFrameRef || 9;
        this.yFrameRef = yFrameRef || 0; // The starting position of the y sprite frame
        this.width = 64; // width, height - same as sprite
        this.height = 64;

        // A Mouse "has a" sprite
        this.sprite = new Sprite(spriteSheetImg, this.xFrameRef, this.yFrameRef, this.width, this.height, 10, 3, false);

        // Change the row position in the sprite sheet
        // do show different walk states
        this.dir = this.dir = Utils.randomNum(4) - 1; // 0-3 random facing value to start
        this.facing = {
            down: 0,
            left: 1,
            right: 2,
            up: 3
        };

        this.mouseSpeed = mouseSpeed || 2.0;

        // Change direction counter:
        this.counter = 0;
        this.counterThreshold = Utils.randomNum(3); // 1-3 sec.

        // Property of mouse
        this.alive = true; // Alive to start
    };

    // Call this before update()
    Mouse.prototype.updateDirection = function(deltaTime) {
        this.counter += deltaTime;
        if(this.counter >= this.counterThreshold) {
            this.counter = 0;

            // Change direction
            this.dir = Utils.randomNum(4) - 1; // 0-3
        }
    }


    Mouse.prototype.update = function(deltaTime) {
        if(this.alive) {

            // We transfer the coordinates of the player
            // to it's visual representation (i.e. the sprite)
            this.sprite.x = this.x;
            this.sprite.y = this.y;

            // Include the starting reference along with the row
            // (this sprite sheet has 4 rows, with 3 frames for each direction)
            this.sprite.frameYOffset = this.yFrameRef + this.dir;
 
            // Now make sure the sprite updates
            this.sprite.update(deltaTime);

        }
    }

    Mouse.prototype.render = function(context) {
        if(this.alive) {
            // Render the visual representation of the player
            this.sprite.render(context);      
        }      
    }

    // Provide the position and dimensions of a rectangle to compare with player rect
    // Returns true if player intersecting with the given rectangle
    Mouse.prototype.intersectsWith = function(rectX, rectY, rectWidth, rectHeight) {

        if (rectX < this.x + this.width && this.x < rectX + rectWidth && rectY < this.y + this.height)
            return this.y < rectY + rectHeight;
        else
            return false;
    }

    window.Mouse = Mouse;

})();