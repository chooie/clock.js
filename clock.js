/**
 * Created by chooie on 31/01/2015.
 */
(function () {
    "use strict";

    var CONSTANTS = {
        PI: Math.PI,
        OUTER_CIRCLE_RADIUS: 99,
        INNER_CIRCLE_RADIUS: 94,
        LINE_LENGTH: 85
    };

    /**
     * Fill in the clock numbers in the given context.
     * @param context
     */
    function fillClockNumbers(context) {
        context.font = "bold 14px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.rotate((90 * CONSTANTS.PI) / 180);
        var i,
            posX,
            posY,
            pi = CONSTANTS.PI;
        for (i = 1; i <= 12; i++) {
            posX = CONSTANTS.LINE_LENGTH * Math.sin((i / 12) * 2 * pi);
            posY = -CONSTANTS.LINE_LENGTH * Math.cos((i / 12) * 2 * pi);
            context.fillText("" + i, posX, posY);
        }
        context.restore();
    }

    /**
     * Draw all the clock hands for the given context.
     * @param context
     */
    function drawTimeToCanvas(context) {
        var dateTime = new Date(),
            hours = dateTime.getHours(),
            minutes = dateTime.getMinutes(),
            seconds = dateTime.getSeconds(),
            secsDegrees = (seconds / 60) * 2 * CONSTANTS.PI,
            secsPosX = CONSTANTS.LINE_LENGTH * Math.cos(secsDegrees),
            secsPosY = CONSTANTS.LINE_LENGTH * Math.sin(secsDegrees),
            secsInMinute = 60 * 60,
            minsDegrees = (((minutes * 60) + seconds) /
                secsInMinute) * 2 * CONSTANTS.PI,
            minsPosX = CONSTANTS.LINE_LENGTH * Math.cos(minsDegrees),
            minsPosY = CONSTANTS.LINE_LENGTH * Math.sin(minsDegrees),
            minutesInHalfADay = 12 * 60,
            hoursDegrees = ((((hours % 12) * 60) + minutes) /
                minutesInHalfADay) * 2 * CONSTANTS.PI,
            hoursPosX = CONSTANTS.LINE_LENGTH * 0.8 * Math.cos(hoursDegrees),
            hoursPosY = CONSTANTS.LINE_LENGTH * 0.8 * Math.sin(hoursDegrees);

        // draw hour hand
        context.moveTo(0, 0);
        context.lineTo(hoursPosX, hoursPosY);

        // draw minute hand
        context.moveTo(0, 0);
        context.lineTo(minsPosX, minsPosY);

        // draw second hand
        context.moveTo(0, 0);
        context.lineTo(secsPosX, secsPosY);
    }

    /**
     * Draw the entire clock.
     * @param drawing
     */
    function drawClock(drawing) {
        var context = drawing.getContext("2d");
        // erase previous context
        context.clearRect(0, 0, drawing.width, drawing.height);

        context.save();
        // start the path
        context.beginPath();

        // draw outer circle
        context.arc(100, 100, CONSTANTS.OUTER_CIRCLE_RADIUS,
            0, 2 * CONSTANTS.PI, false);

        // draw inner circle
        context.moveTo(194, 100);
        context.arc(100, 100, CONSTANTS.INNER_CIRCLE_RADIUS,
            0, 2 * CONSTANTS.PI, false);

        // translate to center.
        context.translate(100, 100);
        // rotate that context 90 degrees to the left
        context.rotate((-90 * CONSTANTS.PI) / 180);
        context.save();

        fillClockNumbers(context);

        drawTimeToCanvas(context);

        // stroke the path
        context.stroke();
        context.restore();
    }

    /**
     * Redraws the clock every second.
     * @param drawing
     */
    function repeatDrawClock(drawing) {
        setTimeout(function() {
            drawClock(drawing);
            repeatDrawClock(drawing);
        }, 1000);
    }

    var drawing = document.getElementById("drawing");
    drawing.style.border = "3px solid black";

    if (drawing.getContext) {
        drawClock(drawing);
        repeatDrawClock(drawing);
    }
})();
