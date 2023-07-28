const Loader = {
  images: {},
  loadImage(key, src) {
    const img = new Image();
    const d = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));
    img.src = src;
    return d;
  },
  getImage(key) {
    return (key in this.images) ? this.images[key] : null;
  }
};

const mapConfig = {
  cols: 17,
  rows: 10,
  tsize: 64,
  layers: [[
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
      2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
      2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
      2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
      2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1,
      2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2
  ],[
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]],
  getTile: function (layer, col, row) {
      return this.layers[layer][row * mapConfig.cols + col];
  }
};

//
// Map object
//

const MapHandler = {
  run(context) {
    this.ctx = context;
    this._previousElapsed = 0;

    const p = this.load();
    Promise.all(p).then(function (loaded) {
        this.init();
        // window.requestAnimationFrame(this.tick);
        this.render();
    }.bind(this));
  },
  load() {
    return [
      Loader.loadImage('tiles', '../images/map_tiles.png')
    ];
  },
  init() {
    this.tileAtlas = Loader.getImage('tiles');
  },
  drawLayer(layer) {
    // console.log(this);
    for (let c = 0; c < mapConfig.cols; c++) {
      for (let r = 0; r < mapConfig.rows; r++) {
        let tile = mapConfig.getTile(layer, c, r);
        if (tile !== 0) { // 0 => empty tile
          this.ctx.drawImage(
            this.tileAtlas, // image
            (tile - 1) * mapConfig.tsize, // source x
            0, // source y
            mapConfig.tsize, // source width
            mapConfig.tsize, // source height
            c * mapConfig.tsize,  // target x
            r * mapConfig.tsize, // target y
            mapConfig.tsize, // target width
            mapConfig.tsize // target height
          );
        }
      }
    }
  },
  render() {
    this.drawLayer(0);
    this.drawLayer(1);
  }
};

//
// start up function
//

window.onload = function () {
    const context = document.getElementById('map-bg').getContext('2d');
    MapHandler.run(context);
};
