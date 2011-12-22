(function() {
    var WIDTH   = 320,
        HEIGHT  = 240,
        SCALE   = 2,
        running = false,
        kb      = new KeyboardControls(),
        canvas, context,
        x, y;

    var requestFrame = (function() {
        return window.mozRequestAnimationFrame ||
               window.msRequestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               function(callback) {
                   setTimeout(callback, 30);
               };
    })();

    function tick() {
        var ox = x,
            oy = y;
        if (kb.keys[kb.LEFT])
            x -= 4;
        if (kb.keys[kb.RIGHT])
            x += 4;
        if (kb.keys[kb.UP])
            y -= 4;
        if (kb.keys[kb.DOWN])
            y += 4;
        if (x + 16 > WIDTH) x = WIDTH - 16;
        if (y + 16 > HEIGHT) y = HEIGHT - 16;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
    }

    function start() {
        running = true;
        loop();
    }

    function loop() {
        tick();
        render();
        if (running) {
            requestFrame(loop, canvas);
        }
    }

    function stop() {
        running = false;
    }

    function render() {
        context.fillStyle = "#ccc";
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = "#000";
        context.beginPath();
        context.arc(x+8,y+8,8,0,6.28);
        context.fill();
    }

    function init() {
        x = 0;
        y = 0;
        canvas = document.createElement('canvas');
        canvas.width = WIDTH * SCALE;
        canvas.height = HEIGHT * SCALE;

        context = canvas.getContext('2d');
        context.scale(SCALE,SCALE);

        $("#game").append(canvas);

        start();
    }

    $(init);
})();