/**
 * Created by chooie on 31/01/2015.
 */

(function(Chooie) {
    /**
     *
     * @param canvas
     * @constructor
     */
    Chooie.Clock = function(canvas) {
        if ( ! canvas instanceof HTMLCanvasElement) {
            throw new Error("Clock: parameter [0] must be an instance of " +
            "HTMLCanvasElement");
        }

        if ( ! canvas.getContext instanceof Function) {
            throw new Error("Clock: canvas element is not supported in the " +
            "current environment.")
        }

        // Scope safe
        if (this instanceof Chooie.Clock) {
            this.context = canvas.getContext("2d");
        } else {
            return new Chooie.Clock(canvas);
        }
    };

    // Declare constants on prototype
    Chooie.Clock.prototype.OUTER_CIRCLE_RADIUS = 99;
    Chooie.Clock.prototype.INNER_CIRCLE_RADIUS = 94;
    Chooie.Clock.prototype.HAND_ORIGIN_CIRCLE_RADIUS = 5;
    Chooie.Clock.prototype.NUMBERS_CIRCLE_RADIUS = 85;
    Chooie.Clock.prototype.SECOND_LINE_LENGTH = 85;
    Chooie.Clock.prototype.SECOND_LINE_WIDTH = 1;
    Chooie.Clock.prototype.MINUTE_LINE_LENGTH = 85;
    Chooie.Clock.prototype.MINUTE_LINE_WIDTH = 3;
    Chooie.Clock.prototype.HOUR_LINE_LENGTH = 50;
    Chooie.Clock.prototype.HOUR_LINE_WIDTH = 5;
    Chooie.Clock.prototype.PI = Math.PI;


    Chooie.Clock.prototype.fillClockNumbers = function(fillStyle) {
        var ctx = this.context,
            NCR = this.NUMBERS_CIRCLE_RADIUS,
            PI = this.PI,
            i,
            posX,
            posY;

        ctx.save();

        // Text styling
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Set optional fillStyle attribute
        if (typeof fillStyle === "string") {
            ctx.fillStyle = fillStyle;
        }

        // Rotate 90 degrees so that the clock numbers are in the correct
        // position
        ctx.rotate((90 * this.PI) / 180);

        // Draw the numbers from 1 to 12
        for (i = 1; i <= 12; i++) {
            posX = NCR * Math.sin((i / 12) * 2 * PI);
            posY = NCR * Math.cos((i / 12) * 2 * PI);
            ctx.fillText("" + i, posX, posY);
        }

        ctx.restore();
    };

    /**
     * Draw all the clock hands for the given context.
     */
    Chooie.Clock.prototype.drawTimeToCanvas = function() {
        var dateTime = new Date();
        this.drawSecondHand(dateTime);
        this.drawMinuteHand(dateTime);
        this.drawHourHand(dateTime);
    };

    /**
     * Draw the second hand.
     * @param date
     */
    Chooie.Clock.prototype.drawSecondHand = function(date) {
        var secLen = this.SECOND_LINE_LENGTH,
            secsDegrees = (date.getSeconds() / 60) * 2 * this.PI,
            secsPosX = secLen * Math.cos(secsDegrees),
            secsPosY = secLen * Math.sin(secsDegrees);

        this.drawHand(secsPosX, secsPosY, this.SECOND_LINE_WIDTH);
    };

    /**
     * Draw the minute hand.
     * @param date
     */
    Chooie.Clock.prototype.drawMinuteHand = function(date) {
        var minLen = this.MINUTE_LINE_LENGTH,
            secsInMinute = 60 * 60,
            minsDegrees = (((date.getMinutes() * 60) + date.getSeconds()) /
                secsInMinute) * 2 * this.PI,
            minsPosX = minLen * Math.cos(minsDegrees),
            minsPosY = minLen * Math.sin(minsDegrees);

        this.drawHand(minsPosX, minsPosY, this.MINUTE_LINE_WIDTH);
    };

    /**
     * Draw the hour hand.
     * @param date
     */
    Chooie.Clock.prototype.drawHourHand = function(date) {
        var hourLen = this.HOUR_LINE_LENGTH,
            minutesInHalfADay = 12 * 60,
            hoursDegrees = ((((date.getHours() % 12) * 60) +
                date.getMinutes()) / minutesInHalfADay) * 2 * this.PI,
            hoursPosX = hourLen * Math.cos(hoursDegrees),
            hoursPosY = hourLen * Math.sin(hoursDegrees);

        this.drawHand(hoursPosX, hoursPosY, this.HOUR_LINE_WIDTH);
    };

    /**
     * Draws a clock hand.
     * @param posX
     * @param posY
     * @param lineWidth
     */
    Chooie.Clock.prototype.drawHand = function(posX, posY, lineWidth) {
        var ctx = this.context;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineWidth = lineWidth;
        ctx.lineTo(posX, posY);
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        ctx.restore();

    };

    /**
     * Draw the entire clock.
     */
    Chooie.Clock.prototype.drawClock = function() {
        var ctx = this.context;

        ctx.save(); // save initial context

        // Erase previous context
        ctx.clearRect(0, 0, this.context.canvas.width,
            this.context.canvas.height);

        // Beginning of coordinate translation
        // Translate to center.
        ctx.translate(100, 100);

        // Outer face
        this.drawFace(0, 0, this.OUTER_CIRCLE_RADIUS, 0, 2 * this.PI,
            false, "#336E7B");

        // Inner face
        this.drawFace(0, 0, this.INNER_CIRCLE_RADIUS, 0, 2 * this.PI,
            false, "#22313F");

        // Rotate the context 90 degrees to the left
        ctx.rotate((-90 * this.PI) / 180);


        this.fillClockNumbers(ctx, "#FFFFFF");

        this.drawTimeToCanvas(ctx);

        // Hand origin face (the circle where the hands come out of)
        this.drawFace(0, 0, this.HAND_ORIGIN_CIRCLE_RADIUS, 0,
            2 * this.PI, false, "#19B5FE");

        ctx.restore(); // restore initial context
    };

    /**
     * Redraws the clock every second (1000ms).
     */
    Chooie.Clock.prototype.repeatDrawClock = function() {
        // Note that 'that' is assigned the current 'this' context because
        // 'setTimeout' always executes within the 'window' context
        var that = this;
        setTimeout(function() {
            that.drawClock(this.canvas);
            that.repeatDrawClock();
        }, 1000);
    };

    /**
     * Draw clock face.
     * @param posX
     * @param posY
     * @param radius
     * @param startAngle
     * @param endAngle
     * @param counterClockWise
     * @param fillColour
     */
    Chooie.Clock.prototype.drawFace = function(posX, posY, radius, startAngle,
                                        endAngle, counterClockWise,
                                        fillColour) {
        var ctx = this.context;

        ctx.save();

        // Start outer circle path
        ctx.beginPath();

        // Draw circle
        ctx.arc(posX, posY, radius, startAngle, endAngle, counterClockWise);

        // Close outer circle path
        ctx.closePath();

        // Option fill colour
        if (typeof fillColour === "string") {
            ctx.fillStyle = fillColour;
            ctx.fill();
        }

        // Stroke the path
        ctx.stroke();

        ctx.restore();
    };
})(window.Chooie = window.Chooie || {});
