var Loader = {
  images: {},
  loadImage(key, src) {
    var img = new Image();
    var d = new Promise(function (resolve, reject) {
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

var mapConfig = {
  cols: 17,
  rows: 10,
  tsize: 64,
  layers: [[
      1, 3, 3, 3, 1, 1, 3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 2, 1, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 2, 1,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 3, 3, 3, 3,
      3, 2, 1, 3, 3, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 3, 3, 3, 3,
      3, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1,
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3, 3, 3, 3
  ],[
      0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5,
      0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5,
      0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4,
      4, 0, 0, 4, 4, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 5, 5, 5, 0, 0, 0, 5,
      0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5,
      0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4,
      5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]],
  getTile: function (layer, col, row) {
      return this.layers[layer][row * mapConfig.cols + col];
  }
};

//
// Map object
//

var Map = {
  run(context) {
    this.ctx = context;
    this._previousElapsed = 0;

    var p = this.load();
    Promise.all(p).then(function (loaded) {
        this.init();
        // window.requestAnimationFrame(this.tick);
        this.render();
    }.bind(this));
  },
  load() {
    return [
      Loader.loadImage('tiles', '../images/tiles.png')
    ];
  },
  init() {
    this.tileAtlas = Loader.getImage('tiles');
  },
  drawLayer(layer) {
    console.log(this);
    for (var c = 0; c < mapConfig.cols; c++) {
      for (var r = 0; r < mapConfig.rows; r++) {
        var tile = mapConfig.getTile(layer, c, r);
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
    var context = document.getElementById('map').getContext('2d');
    Map.run(context);
};
