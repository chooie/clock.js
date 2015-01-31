/**
 * Created by chooie on 31/01/2015.
 */
(function () {
    "use strict";
    var drawing = document.getElementById("drawing");
    drawing.style.border = "3px solid black";

    if ( ! drawing.getContext) {
        throw new Error("Canvas: This object does not support the canvas API.");
    }

    Clock.drawClock(drawing);
    Clock.repeatDrawClock(drawing);
})();
