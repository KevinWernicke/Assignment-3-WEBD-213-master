(function() {


    // spriteSheetImg - the image containing all the frames
    // xFrameRef - the column position starting at 0 in spritesheet where sprite frames start
    // yFrameRef - the row position starting at 0 in spritesheet where sprite frames start
    function Player(spriteSheetImg, xFrameRef, yFrameRef) {
       
        // Player's position
        this.x = 0;
        this.y = 0;

        this.xFrameRef = xFrameRef || 9;
        this.yFrameRef = yFrameRef || 0; // The starting position of the y sprite frame
        this.width = 64; // width, height - same as sprite
        this.height = 64;

        // A player "has a" sprite
        this.sprite = new Sprite(spriteSheetImg, this.xFrameRef, this.yFrameRef, this.width, this.height, 10, 3, false);

        // Change the row position in the sprite sheet
        // do show different walk states
        this.dir = 0; // Assign facing values to this
        this.facing = {
            down: 0,
            left: 1,
            right: 2,
            up: 3
        };

        this.idle = false;

    };

    Player.prototype.update = function(deltaTime) {
        
        // We transfer the coordinates of the player
        // to it's visual representation (i.e. the sprite)
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        // Include the starting reference along with the row
        // (this sprite sheet has 4 rows, with 3 frames for each direction)
        this.sprite.frameYOffset = this.yFrameRef + this.dir;
       
        // Set the animation idle property
        this.sprite.pauseAnim = this.idle;

        // Now make sure the sprite updates
        this.sprite.update(deltaTime);
    }

    Player.prototype.render = function(context) {
        // Render the visual representation of the player
        this.sprite.render(context);            
    }

    // Provide the position and dimensions of a rectangle to compare with player rect
    // Returns true if player intersecting with the given rectangle
    Player.prototype.intersectsWith = function(rectX, rectY, rectWidth, rectHeight) {

        if (rectX < this.x + this.width && this.x < rectX + rectWidth && rectY < this.y + this.height)
            return this.y < rectY + rectHeight;
        else
            return false;
    }

    window.Player = Player;

})();