/**
 * Created by chooie on 31/01/2015.
 */
var Clock = (function () {
    "use strict";

    var OUTER_CIRCLE_RADIUS = 99,
        INNER_CIRCLE_RADIUS = 94,
        NUMBERS_CIRCLE_RADIUS = 85,
        SECOND_LINE_LENGTH = 85,
        SECOND_LINE_WIDTH = 2,
        MINUTE_LINE_LENGTH = 85,
        MINUTE_LINE_WIDTH = 3,
        HOUR_LINE_LENGTH = 50,
        HOUR_LINE_WIDTH = 5,
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
            posY;
        for (i = 1; i <= 12; i++) {
            posX = NUMBERS_CIRCLE_RADIUS * Math.sin((i / 12) * 2 * PI);
            posY = -NUMBERS_CIRCLE_RADIUS * Math.cos((i / 12) * 2 * PI);
            context.fillText("" + i, posX, posY);
        }
        context.restore();
    }

    /**
     * Draw all the clock hands for the given context.
     * @param context
     */
    function drawTimeToCanvas(context) {
        var dateTime = new Date();
        drawSecondHand(context, dateTime);
        drawMinuteHand(context, dateTime);
        drawHourHand(context, dateTime);
    }

    function drawSecondHand(context, date) {
        var secLen = SECOND_LINE_LENGTH,
            secsDegrees = (date.getSeconds() / 60) * 2 * PI,
            secsPosX = secLen * Math.cos(secsDegrees),
            secsPosY = secLen * Math.sin(secsDegrees);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(secsPosX, secsPosY);
        context.stroke();
    }

    function drawMinuteHand(context, date) {
        var minLen = MINUTE_LINE_LENGTH,
            secsInMinute = 60 * 60,
            minsDegrees = (((date.getMinutes() * 60) + date.getSeconds()) /
                secsInMinute) * 2 * PI,
            minsPosX = minLen * Math.cos(minsDegrees),
            minsPosY = minLen * Math.sin(minsDegrees);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(minsPosX, minsPosY);
        context.stroke();
    }

    function drawHourHand(context, date) {
        var hourLen = HOUR_LINE_LENGTH,
            minutesInHalfADay = 12 * 60,
            hoursDegrees = ((((date.getHours() % 12) * 60) +
                date.getMinutes()) / minutesInHalfADay) * 2 * PI,
            hoursPosX = hourLen * Math.cos(hoursDegrees),
            hoursPosY = hourLen * Math.sin(hoursDegrees);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(hoursPosX, hoursPosY);
        context.stroke();
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

        // stroke the path
        context.stroke();

        context.save();

        fillClockNumbers(context);

        drawTimeToCanvas(context);

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

    // Expose Object methods
    return {
        repeatDrawClock: repeatDrawClock,
        drawClock: drawClock
    }
})();
