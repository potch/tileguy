function Screen(size, tileSize, viewWidth, viewHeight, map, spriteSheet) {
    var sheetSize = spriteSheet.size,
        tileWidth = 1 << tileSize,
        sheetWidth = 1 << sheetSize,
        mapWidth = 1 << size,
        spriteCtx = spriteSheet.data,
        maxViewX = mapWidth * tileWidth - viewWidth,
        maxViewY = mapWidth * tileWidth - viewHeight,
        mapIndex, x, y,
        internalCanvas = document.createElement('canvas'),
        internalContext = internalCanvas.getContext('2d'),
        shiftX, shiftY;

    internalCanvas.width = viewWidth;
    internalCanvas.height = viewHeight;

    var viewX = 0,
        viewY = 0;

    this.pan = function(dx, dy) {
        var newX = viewX + dx,
            newY = viewY + dy;
        viewX = Math.max(0,Math.min(newX, maxViewX));
        viewY = Math.max(0,Math.min(newY, maxViewY));
        this.render(internalContext);
    };

    this.getCanvas = function() {
        return internalCanvas;
    };

    this.incMapAtCursor = function(x,y,d) {
        var mx = (viewX + x) >> tileSize,
            my = (viewY + y) >> tileSize,
            idx = my * mapWidth + mx;
        map[idx] = (map[idx] + d) % (sheetWidth * sheetWidth);
        this.render(internalContext);
    };

    this.render = function(ctx, ox, oy) {
        ox = ox || viewX;
        oy = oy || viewY;
        shiftX = -ox % tileWidth;
        shiftY = -oy % tileWidth;
        for (y = 0; y <= (viewHeight >> tileSize) + 1; y++) {
            for (x = 0; x <= (viewWidth >> tileSize); x++) {
                mapIndex = map[(y * mapWidth + x + ((oy >> tileSize) * mapWidth + (ox >> tileSize)))];
                spriteSheet.put(ctx, 
                                shiftX + (x << tileSize),
                                shiftY + (y << tileSize),
                                mapIndex);
            }
        }
    };

    this.render(internalContext);
}