"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/ts/simple-roguelike-terminal/glyph.ts
  var _Color, Color, Glyph;
  var init_glyph = __esm({
    "src/ts/simple-roguelike-terminal/glyph.ts"() {
      "use strict";
      _Color = class {
        static makeDarker(color, factor) {
          return new _Color(
            Math.max(Math.floor(color.r * factor), 0),
            Math.max(Math.floor(color.g * factor), 0),
            Math.max(Math.floor(color.b * factor), 0)
          );
        }
        constructor(r, g, b) {
          this.r = r;
          this.g = g;
          this.b = b;
        }
      };
      Color = _Color;
      Color.black = new _Color(0, 0, 0);
      //public static readonly gray = new Color(0, 0, 0);
      Color.darkestGrey = new _Color(31, 31, 31);
      Color.darkerGrey = new _Color(63, 63, 63);
      Color.darkGrey = new _Color(95, 95, 95);
      Color.grey = new _Color(127, 127, 127);
      Color.lightGrey = new _Color(159, 159, 159);
      Color.lighterGre = new _Color(191, 191, 191);
      Color.lightestGr = new _Color(223, 223, 223);
      Color.white = new _Color(255, 255, 255);
      Color.red = new _Color(255, 0, 0);
      Color.flame = new _Color(255, 63, 0);
      Color.orange = new _Color(255, 127, 0);
      Color.amber = new _Color(255, 191, 0);
      Color.yellow = new _Color(255, 255, 0);
      Color.lime = new _Color(191, 255, 0);
      Color.chartreuse = new _Color(127, 255, 0);
      Color.green = new _Color(0, 255, 0);
      Color.sea = new _Color(0, 255, 127);
      Color.turquoise = new _Color(0, 255, 191);
      Color.cyan = new _Color(0, 255, 255);
      Color.sky = new _Color(0, 191, 255);
      Color.azure = new _Color(0, 127, 255);
      Color.blue = new _Color(0, 0, 255);
      Color.han = new _Color(63, 0, 255);
      Color.violet = new _Color(127, 0, 255);
      Color.purple = new _Color(191, 0, 255);
      Color.fuchsia = new _Color(255, 0, 255);
      Color.magenta = new _Color(255, 0, 191);
      Color.pink = new _Color(255, 0, 127);
      Color.crimson = new _Color(255, 0, 63);
      Glyph = class {
        constructor(glyph, fcolor, bcolor, data, darkerGlyph) {
          this.glyph = glyph;
          this.fcolor = fcolor;
          this.bcolor = bcolor;
          this.glyphData = data;
          this.darkerGlyphData = darkerGlyph;
        }
        get data() {
          return this.glyphData;
        }
        get tinted() {
          return this.darkerGlyphData;
        }
      };
    }
  });

  // src/ts/simple-roguelike-terminal/display.ts
  var Display;
  var init_display = __esm({
    "src/ts/simple-roguelike-terminal/display.ts"() {
      "use strict";
      Display = class {
        constructor(width, height) {
          this.glyphs = [];
          this.changedGlyphs = [];
          this.width = width;
          this.height = height;
        }
        putChar(glyph, x, y) {
          if (x < 0)
            return;
          if (x >= this.width)
            return;
          if (y < 0)
            return;
          if (y >= this.height)
            return;
          this.changedGlyphs[x + y * this.width] = glyph;
        }
        render(ctx, stepx, stepy) {
          let count = 0;
          for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
              let glyph = this.changedGlyphs[x + y * this.width];
              if (glyph === null || glyph === void 0)
                continue;
              if (this.changedGlyphs[x + y * this.width] == this.glyphs[x + y * this.width])
                continue;
              count++;
              ctx.putImageData(glyph.data, x * stepx, y * stepy);
              this.glyphs[x + y * this.width] = glyph;
              this.changedGlyphs[x + y * this.width] = null;
            }
            ;
          }
          ;
          console.log(`number of calls to putImageData(): ${count}`);
        }
      };
    }
  });

  // src/ts/simple-roguelike-terminal/terminal.ts
  var Terminal;
  var init_terminal = __esm({
    "src/ts/simple-roguelike-terminal/terminal.ts"() {
      "use strict";
      init_glyph();
      init_display();
      Terminal = class {
        constructor(width, height, tilesetUrl, stepx, stepy) {
          this.tiles = [];
          this.width = width;
          this.height = height;
          this.stepx = stepx;
          this.stepy = stepy;
          this.widthPixels = width * stepx;
          this.heightPixels = height * stepy;
          this.canvas = document.createElement("canvas");
          this.canvas.width = this.widthPixels;
          this.canvas.height = this.heightPixels;
          this.ctx = this.canvas.getContext("2d", { alpha: false, willReadFrequently: true });
          this.ctx.imageSmoothingEnabled = false;
          document.body.appendChild(this.canvas);
          this.imgLoaded = new CustomEvent("imgLoaded");
          this.tileset = new Image();
          this.tileset.onload = () => this.tilesetLoaded();
          this.tileset.src = tilesetUrl;
          this.display = new Display(width, height);
        }
        tilesetLoaded() {
          console.log(`loaded: ${this.tileset.src}`);
          this.ctx.drawImage(this.tileset, 0, 0);
          for (let i = 0; i < 16; ++i) {
            for (let j = 0; j < 16; ++j) {
              this.tiles.push(this.ctx.getImageData(j * this.stepx, i * this.stepy, this.stepx, this.stepy));
            }
          }
          this.clear();
          document.dispatchEvent(this.imgLoaded);
        }
        defineGlyph(glyph, fcolor, bcolor, factor = 0.3) {
          if (glyph < 0)
            throw new RangeError(`out of tileset bounds: ${glyph}<0`);
          if (glyph >= 256)
            throw new RangeError(`out of tileset bounds: ${glyph}>=256`);
          let glyphData;
          let darkerGlyphData;
          let darkerFColor = Color.makeDarker(fcolor, factor);
          let darkerBColor = Color.makeDarker(bcolor, factor);
          let currentTile = 0;
          this.tiles.forEach((tile) => {
            if (currentTile != glyph) {
              currentTile++;
              return;
            }
            currentTile++;
            glyphData = structuredClone(tile);
            darkerGlyphData = structuredClone(tile);
            let imgData = glyphData.data;
            let darkerImgData = darkerGlyphData.data;
            for (let y = 0; y < this.stepx; ++y) {
              for (let x = 0; x < this.stepy; ++x) {
                let index = (x + this.stepx * y) * 4;
                if (imgData[index] === 255 && imgData[index + 1] === 255 && imgData[index + 2] === 255) {
                  imgData[index] = fcolor.r;
                  imgData[index + 1] = fcolor.g;
                  imgData[index + 2] = fcolor.b;
                  darkerImgData[index] = darkerFColor.r;
                  darkerImgData[index + 1] = darkerFColor.g;
                  darkerImgData[index + 2] = darkerFColor.b;
                } else if (imgData[index] === 0 && imgData[index + 1] === 0 && imgData[index + 2] === 0) {
                  imgData[index] = bcolor.r;
                  imgData[index + 1] = bcolor.g;
                  imgData[index + 2] = bcolor.b;
                  darkerImgData[index] = darkerBColor.r;
                  darkerImgData[index + 1] = darkerBColor.g;
                  darkerImgData[index + 2] = darkerBColor.b;
                }
                ;
              }
              ;
            }
            ;
          });
          return new Glyph(glyph, fcolor, bcolor, glyphData, darkerGlyphData);
        }
        clear() {
          this.ctx.fillStyle = "#000000";
          this.ctx.fillRect(0, 0, this.widthPixels, this.heightPixels);
        }
        putChar(glyph, x, y) {
          this.display.putChar(glyph, x, y);
        }
        render() {
          this.display.render(this.ctx, this.stepx, this.stepy);
        }
      };
    }
  });

  // src/ts/main.ts
  var require_main = __commonJS({
    "src/ts/main.ts"(exports) {
      init_terminal();
      init_glyph();
      var Game = class {
        constructor() {
          this.sightRadius = 8;
          this.contentStorage = null;
          this.currentMap = null;
          this.player = null;
          this.currentScreen = null;
          console.log("Game constructor");
          let player = terminal.defineGlyph(64, Color.white, Color.black);
          let player2 = terminal.defineGlyph(64, Color.red, Color.black);
          terminal.putChar(player, 25, 25);
          terminal.putChar(player2, 26, 25);
          terminal.render();
        }
      };
      var terminal = new Terminal(50, 50, "data/cp437_16x16.png", 16, 16);
      var game;
      document.addEventListener("imgLoaded", gameInit.bind(exports));
      function gameInit(e) {
        console.log("imgLoaded event");
        game = new Game();
        document.removeEventListener("imgLoaded", gameInit);
      }
    }
  });
  require_main();
})();
