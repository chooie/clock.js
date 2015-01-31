/**
 * Created by chooie on 31/01/2015.
 */
(function () {
    "use strict";

    var OUTER_CIRCLE_RADIUS = 99,
        INNER_CIRCLE_RADIUS = 94,
        NUMBERS_CIRCLE_RADIUS = 85,
        SECOND_LINE_LENGTH = 85,
        MINUTE_LINE_LENGTH = 85,
        HOUR_LINE_LENGTH = 75,
        PI = Math.PI;

    /**
     * Fill in the clock numbers in the given context.
     * @param context
     */
    function fillClockNumbers(context) {
        context.font = "bold 14px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.rotate((90 * PI) / 180);
        var i,
            posX,
            posY,
            pi = PI;
        for (i = 1; i <= 12; i++) {
            posX = NUMBERS_CIRCLE_RADIUS * Math.sin((i / 12) * 2 * pi);
            posY = -NUMBERS_CIRCLE_RADIUS * Math.cos((i / 12) * 2 * pi);
            context.fillText("" + i, posX, posY);
        }
        context.restore();
    }

    /**
     * Draw all the clock hands for the given context.
     * @param context
     */
    function drawTimeToCanvas(context) {
        // Save the current context
        context.save();

        var dateTime = new Date(),
            // Get current time
            hours = dateTime.getHours(),
            minutes = dateTime.getMinutes(),
            seconds = dateTime.getSeconds(),
            // Lengths of each hand of the clock
            secLen = SECOND_LINE_LENGTH,
            minLen = MINUTE_LINE_LENGTH,
            hourLen = HOUR_LINE_LENGTH,
            // Seconds hand
            secsDegrees = (seconds / 60) * 2 * PI,
            secsPosX = secLen * Math.cos(secsDegrees),
            secsPosY = secLen * Math.sin(secsDegrees),
            // Minutes hand
            secsInMinute = 60 * 60,
            minsDegrees = (((minutes * 60) + seconds) / secsInMinute) * 2 * PI,
            minsPosX = minLen * Math.cos(minsDegrees),
            minsPosY = minLen * Math.sin(minsDegrees),
            // Hours hand
            minutesInHalfADay = 12 * 60,
            hoursDegrees = ((((hours % 12) * 60) + minutes) /
                minutesInHalfADay) * 2 * PI,
            hoursPosX = hourLen * 0.8 * Math.cos(hoursDegrees),
            hoursPosY = hourLen * 0.8 * Math.sin(hoursDegrees);

        // draw hour hand
        context.moveTo(0, 0);
        context.strokeWidth = 3;
        context.lineTo(hoursPosX, hoursPosY);

        // draw minute hand
        context.moveTo(0, 0);
        context.strokeWidth = 3;
        context.lineTo(minsPosX, minsPosY);

        // draw second hand
        context.moveTo(0, 0);
        context.strokeWidth = 1;
        context.lineTo(secsPosX, secsPosY);

        // Restore the initial context
        context.restore();
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
        context.arc(100, 100, OUTER_CIRCLE_RADIUS, 0, 2 * PI, false);

        // draw inner circle
        context.moveTo(194, 100);
        context.arc(100, 100, INNER_CIRCLE_RADIUS, 0, 2 * PI, false);

        // translate to center.
        context.translate(100, 100);
        // rotate that context 90 degrees to the left
        context.rotate((-90 * PI) / 180);
        context.save();

        fillClockNumbers(context);

        drawTimeToCanvas(context);

        // stroke the path
        context.stroke();
        context.restore();
    }

    /**
     * Redraws the clock every second (1000ms).
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
