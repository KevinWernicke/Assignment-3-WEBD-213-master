(function(obj) {
    
    // Random number between 1 and max
    var _randomNum = function _randomNum(max) {
        return Math.floor((Math.random() * max) + 1);
    };

    // Check if 2 rectangles intersect
    var _intersects = function _intersects(r1X, r1Y, r1Width, r1Height, r2X, r2Y, r2Width, r2Height) {

        if (r1X < r2X + r2Width && r2X < r1X + r1Width && r1Y < r2Y + r2Height)
            return r2Y < r1Y + r1Height;
        else
            return false;
    }

    obj.randomNum = _randomNum;
    obj.intersects = _intersects;

})(window.Utils = window.Utils || {});