/**
 * Created by chooie on 31/01/2015.
 */
var Clock = (function () {
    "use strict";

    var OUTER_CIRCLE_RADIUS = 99,
        INNER_CIRCLE_RADIUS = 94,
        HAND_ORIGIN_CIRCLE_RADIUS = 5,
        NUMBERS_CIRCLE_RADIUS = 85,
        SECOND_LINE_LENGTH = 85,
        SECOND_LINE_WIDTH = 1,
        MINUTE_LINE_LENGTH = 85,
        MINUTE_LINE_WIDTH = 3,
        HOUR_LINE_LENGTH = 50,
        HOUR_LINE_WIDTH = 5,
        PI = Math.PI;

    /**
     * Fill in the clock numbers in the given context.
     * @param context
     * @param fillStyle
     */
    function fillClockNumbers(context, fillStyle) {
        context.save();
        context.font = "bold 14px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        if (typeof fillStyle === "string") {
            context.fillStyle = fillStyle;
        }
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

    /**
     * Draw the second hand.
     * @param context
     * @param date
     */
    function drawSecondHand(context, date) {
        var secLen = SECOND_LINE_LENGTH,
            secsDegrees = (date.getSeconds() / 60) * 2 * PI,
            secsPosX = secLen * Math.cos(secsDegrees),
            secsPosY = secLen * Math.sin(secsDegrees);

        drawHand(context, secsPosX, secsPosY, SECOND_LINE_WIDTH);
    }

    /**
     * Draw the minute hand.
     * @param context
     * @param date
     */
    function drawMinuteHand(context, date) {
        var minLen = MINUTE_LINE_LENGTH,
            secsInMinute = 60 * 60,
            minsDegrees = (((date.getMinutes() * 60) + date.getSeconds()) /
                secsInMinute) * 2 * PI,
            minsPosX = minLen * Math.cos(minsDegrees),
            minsPosY = minLen * Math.sin(minsDegrees);

        drawHand(context, minsPosX, minsPosY, MINUTE_LINE_WIDTH);
    }

    /**
     * Draw the hour hand.
     * @param context
     * @param date
     */
    function drawHourHand(context, date) {
        var hourLen = HOUR_LINE_LENGTH,
            minutesInHalfADay = 12 * 60,
            hoursDegrees = ((((date.getHours() % 12) * 60) +
                date.getMinutes()) / minutesInHalfADay) * 2 * PI,
            hoursPosX = hourLen * Math.cos(hoursDegrees),
            hoursPosY = hourLen * Math.sin(hoursDegrees);

        drawHand(context, hoursPosX, hoursPosY, HOUR_LINE_WIDTH);
    }

    /**
     * Draws a clock hand.
     * @param context
     * @param posX
     * @param posY
     * @param lineWidth
     */
    function drawHand(context, posX, posY, lineWidth) {
        context.save();
        context.beginPath();
        context.moveTo(0, 0);
        context.lineWidth = lineWidth;
        context.lineTo(posX, posY);
        context.strokeStyle = "#FFFFFF";
        context.stroke();
        context.restore();

    }

    /**
     * Draw the entire clock.
     * @param canvas
     */
    function drawClock(canvas) {

        if (! canvas instanceof HTMLCanvasElement) {
            throw new Error("drawClock: parameter must be an instance of " +
            "HTMLCanvasElement");
        }
        var context = canvas.getContext("2d");

        context.save(); // save initial context

        // Erase previous context
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Beginning of coordinate translation
        // Translate to center.
        context.translate(100, 100);

        // Outer face
        drawFace(context, 0, 0, OUTER_CIRCLE_RADIUS, 0, 2 * PI, false,
            "#336E7B");

        // Inner face
        drawFace(context, 0, 0, INNER_CIRCLE_RADIUS, 0, 2 * PI, false,
            "#22313F");

        // Rotate the context 90 degrees to the left
        context.rotate((-90 * PI) / 180);


        fillClockNumbers(context, "#FFFFFF");

        drawTimeToCanvas(context);

        // Hand origin face (the circle where the hands come out of)
        drawFace(context, 0, 0, HAND_ORIGIN_CIRCLE_RADIUS, 0, 2 * PI, false,
            "#19B5FE");

        context.restore(); // restore initial context
    }

    /**
     * Draw Clock face
     * @param context
     * @param posX
     * @param posY
     * @param radius
     * @param startAngle
     * @param endAngle
     * @param counterClockWise
     * @param fillColour
     */
    function drawFace(context, posX, posY, radius, startAngle, endAngle,
                           counterClockWise, fillColour) {

        context.save();

        // Start outer circle path
        context.beginPath();

        // Draw circle
        context.arc(posX, posY, radius, startAngle, endAngle, counterClockWise);

        // Close outer circle path
        context.closePath();

        // Option fill colour
        if (typeof fillColour === "string") {
            context.fillStyle = fillColour;
            context.fill();
        }

        // Stroke the path
        context.stroke();

        context.restore();
    }

    /**
     * Redraws the clock every second (1000ms).
     * @param canvas
     */
    function repeatDrawClock(canvas) {
        setTimeout(function() {
            drawClock(canvas);
            repeatDrawClock(canvas);
        }, 1000);
    }

    // Expose Object methods
    return {
        repeatDrawClock: repeatDrawClock,
        drawClock: drawClock
    }
})();
