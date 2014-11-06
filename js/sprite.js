// Wrapped in () so that it get executed immediately upon
// loading this script. We want the object "Sprite" defined immediately.
(function() {

    // This would exist across all instances (not unique)
    //var _myStaticVar = 999;

    // The constructor
    // This the function that gets called when
    // you call:  new Sprite(...)
    // Params:
    //      x, y are the column and row in the sprite sheet
    function Sprite(img, frameXOffset, frameYOffset, width, height, animSpeed, numAnimFrames, showBoundingBox) {

        // Public variables //
        // The sprite asset
        this.img = img;
        this.showBoundingBox = showBoundingBox || false;
        
        // Location and size
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        // The column and row of the initial frame of animation
        this.frameXOffset = frameXOffset;
        this.frameYOffset = frameYOffset;
        this.frame = 0;
        
        // Animation vars        
        this.numAnimFrames = numAnimFrames || 1; // Use OR incase not given       
        this.animFrame = 0;
        this.animSpeed = animSpeed || 0;

        this.pauseAnim = false;

    };

    Sprite.prototype.update = function(deltaTime) {
        var animIndex;
              
        // Only do this if there is an animation speed set
        if(this.animSpeed > 0) {
            // Increase the potential animation frame
            // by delta and adjusting for speed.
            if(!this.pauseAnim)
                this.animFrame += this.animSpeed * deltaTime;

            // Since animFrame will be a decimal, we need
            // an integer index for the frame, so floor it.
            animIndex = Math.floor(this.animFrame);

            // To get the actual frame we use modulo "%"
            // which gives us the remainder e.g. 5 % 2 = 1
            // because 2 divides into 5 twice, leaving 1 extra
            // We use that remainder to get the actual frame index
            // without going out of bounds
            this.frame = (animIndex % this.numAnimFrames);           

        } else {
            // No speed means we aren't animating, show the first
            // frame (could be the only frame)
            this.frame = 0;
        }
    }

    Sprite.prototype.render = function(context) {        

        context.drawImage(
            this.img,
            this.width*this.frameXOffset + this.width*this.frame,
            this.height*this.frameYOffset,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height);      

        // Draw bounding box on top if active
        if(this.showBoundingBox) {
            context.save();
            context.strokeStyle = "red";
            context.lineWidth = 1;
            context.strokeRect(this.x+0.5, this.y+0.5, this.width-1, this.height-1);
            context.restore();
        }      
    }

    window.Sprite = Sprite;

})();