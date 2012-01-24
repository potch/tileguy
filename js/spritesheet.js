function SpriteSheet(size, tileSize, data) {
    this.size = size;
    this.data = data;
    this.tileWidth = 1 << tileSize;

    var tileWidth = this.tileWidth;
    var sheetWidth = 1 << size;

    console.log(sheetWidth);

    this.put = function(ctx, x, y, n) {
        ctx.drawImage(data,
                      (n % sheetWidth) * tileWidth,
                      (n >> size) * tileWidth,
                      tileWidth, tileWidth,
                      x, y,
                      tileWidth, tileWidth);
    };
}