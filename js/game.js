(function() {
    var WIDTH   = 160,
        HEIGHT  = 120,
        SCALE   = 4,
        running = false,
        kb      = new KeyboardControls(),
        buffer, boardCanvas, context,
        board,
        viewX = 0, viewY = 0,
        sprite,
        lastTick,
        x, y;

    var requestFrame = (function() {
        return window.requestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.oRequestAnimationFrame ||
               window.msRequestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               function(callback) {
                   setTimeout(callback, 30);
               };
    })();

    function tick() {
        var ox = x,
            oy = y,
            tick = (new Date()).getTime(),
            d = 3;
        if (kb.keys[kb.LEFT])
            x -= d;
        if (kb.keys[kb.RIGHT])
            x += d;
        if (kb.keys[kb.UP])
            y -= d;
        if (kb.keys[kb.DOWN])
            y += d;

        if (x + 16 > WIDTH) {
            x = WIDTH - 16;
            board.pan(d,0);
        } 
        if (y + 16 > HEIGHT) {
            y = HEIGHT - 16;
            board.pan(0,d);
        }
        if (x < 0) {
            x = 0;
            board.pan(-d,0);
        }
        if (y < 0) {
            y = 0;
            board.pan(0,-d);
        }
        lastTick = tick;
    }
    
    function fakeSpriteSheet(size, tileSize) {
        var canvas = document.createElement('canvas'),
            max = 1 << (size * 2),
            tileWidth = 1 << tileSize;
        canvas.width = (1 << size) * tileWidth;
        canvas.height = (1 << size) * tileWidth;
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,0,256,256);
        for (var i = 0; i < max; i++) {
            ctx.beginPath();
            ctx.fillStyle = "rgb(" + ~~(i / max * 256) + "," + ~~(i % 8 / 8 * 256) + "," + ~~(i % 4 / 4 * 256) + ")";
            ctx.arc((i % (1 << size)) * tileWidth + 8, (i >> size) * tileWidth + 8, 8, 0, 6.28, false);
            ctx.fill();
        }
        return {
            size: 3,
            data: $('img')[0]
        };
    }

    function fakeMap(size) {
        var map = [];
        for (var i=0; i < (1 << (size * 2)); i++) {
            map[i] = ~~(Math.random() * 15);
        }
        return map;
    }

    function start() {
        running = true;
        lastTick = (new Date()).getTime();
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
        context.drawImage(board.getCanvas(), 0, 0);
        context.fillStyle = "#000";
        context.beginPath();
        context.arc(x+8,y+8,8,0,6.28);
        context.fill();
        canvas.getContext('2d').drawImage(buffer, 0, 0);
    }

    function init() {
        x = 0;
        y = 0;

        buffer = document.createElement('canvas');
        buffer.width = WIDTH * SCALE;
        buffer.height = HEIGHT * SCALE;

        canvas = document.createElement('canvas');
        canvas.width = WIDTH * SCALE;
        canvas.height = HEIGHT * SCALE;

        sheet = new SpriteSheet(3, 4, $('img')[0]);
        var map = JSON.parse(localStorage['map']);
        board = new Screen(4, 4, WIDTH, HEIGHT, map, sheet);

        context = buffer.getContext('2d');
        context.mozImageSmoothingEnabled = false;
        context.scale(SCALE, SCALE);

        $(window).keydown(function() {
            if (kb.letter('q'))
                board.incMapAtCursor(x,y);
        });
        $("#game").append(canvas);
        $(canvas).click(function(e) {
            board.incMapAtCursor((e.pageX - canvas.offsetLeft)/SCALE, (e.pageY - canvas.offsetTop)/SCALE, kb.letter('a') ? -1 : 1);
        });

        window.map = map;
        start();
    }

    $(function() {
        $('img')[0].onload = init;
        $('img')[0].src = localStorage['spritedata'];
    });
})();