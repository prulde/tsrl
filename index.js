"use strict";
(() => {
  // src/ts/simple-roguelike-terminal/glyph.ts
  var Glyph = class {
    constructor(glyph, fcolor, bcolor, data, darkerGlyph) {
      this._glyph = glyph;
      this._fcolor = fcolor;
      this._bcolor = bcolor;
      this._glyphData = data;
      this._tintedGlyphData = darkerGlyph;
    }
    get glyphData() {
      return this._glyphData;
    }
    get fcol() {
      return this._fcolor;
    }
    get bcol() {
      return this._bcolor;
    }
    // get glyph(): number {
    // 	return this._glyph;
    // }
    get tintedGlyphData() {
      return this._tintedGlyphData;
    }
  };

  // src/ts/simple-roguelike-terminal/color.ts
  var _Color = class {
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
  var Color = _Color;
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

  // src/ts/simple-roguelike-terminal/display.ts
  var Display = class {
    constructor(width, height, stepx, stepy, ctx) {
      this.glyphs = [];
      this.changedGlyphs = [];
      this.width = width;
      this.height = height;
      this.stepx = stepx;
      this.stepy = stepy;
      this.ctx = ctx;
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
    render() {
      let count = 0;
      for (let x = 0; x < this.width; ++x) {
        for (let y = 0; y < this.height; ++y) {
          let glyph = this.changedGlyphs[x + y * this.width];
          if (glyph === null || glyph === void 0)
            continue;
          if (this.changedGlyphs[x + y * this.width] == this.glyphs[x + y * this.width])
            continue;
          count++;
          this.ctx.putImageData(glyph.glyphData, x * this.stepx, y * this.stepy);
          this.glyphs[x + y * this.width] = glyph;
          this.changedGlyphs[x + y * this.width] = null;
        }
      }
      count == 0 ? "" : console.log(`number of calls to putImageData(): ${count}`);
    }
  };

  // src/ts/simple-roguelike-terminal/terminal.ts
  var Terminal = class {
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
      this.display = new Display(width, height, stepx, stepy, this.ctx);
    }
    tilesetLoaded() {
      console.log(`loaded: ${this.tileset.src}`);
      this.ctx.drawImage(this.tileset, 0, 0);
      for (let i = 0; i < 16; ++i) {
        for (let j = 0; j < 16; ++j) {
          this.tiles.push(this.ctx.getImageData(j * this.stepx, i * this.stepy, this.stepx, this.stepy));
        }
      }
      ;
      this.clear();
      document.dispatchEvent(this.imgLoaded);
    }
    defineGlyph(glyph, fcolor, bcolor, factor = 0.3) {
      if (typeof glyph === "string") {
        glyph = glyph.charCodeAt(0);
      }
      ;
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
          }
        }
      });
      return new Glyph(glyph, fcolor, bcolor, glyphData, darkerGlyphData);
    }
    clear() {
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.widthPixels, this.heightPixels);
    }
    putChar(glyph, x, y) {
      if (x < 0 || x > this.width)
        throw new RangeError(`x:${x} must be within range [0,${this.width}]`);
      if (y < 0 || y > this.height)
        throw new RangeError(`y:${y} must be within range [0,${this.height}]`);
      this.display.putChar(glyph, x, y);
    }
    /** @todo */
    // public write(str: string, x: number, y: number, fcol: Color, bcol: Color) {
    // 	if (x + str.length > this.width) throw new RangeError(`x+string.lenght:${y} must be less than ${this.height}]`);
    // 	if (x < 0 || x >= this.width) throw new RangeError(`x:${x} must be within range [0,${this.width}]`);
    // 	if (y < 0 || y >= this.height) throw new RangeError(`y:${y} must be within range [0,${this.height}]`);
    // 	for (let i: number = 0; i < str.length; i++) {
    // 		this.putChar(str.charAt(i), x + i, y);
    // 	}
    // };
    render() {
      this.display.render();
    }
  };

  // src/ts/action/action.ts
  var ActionResult = class {
    constructor(performed, moved, altAction, altScreen) {
      this.performed = performed;
      this.moved = moved;
      this.altAction = altAction;
      this.altScreen = altScreen;
    }
  };
  var WalkAction = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    perform(owner) {
      let targetx = this.x + owner.x;
      let targety = this.y + owner.y;
      if (game.currentMap.isWall(targetx, targety)) {
        return new ActionResult(false, true, null, null);
      }
      const mapActors = game.currentMap.actors;
      for (const actor of mapActors) {
        if (actor.blocks && actor.x === targetx && actor.y === targety) {
          if (!owner.isPlayer && !actor.isPlayer) {
            break;
          }
          return new ActionResult(true, true, null, null);
        }
      }
      owner.x += this.x;
      owner.y += this.y;
      return new ActionResult(true, true, null, null);
    }
  };
  var RestAction = class {
    perform(owner) {
      return new ActionResult(true, false, null, null);
    }
  };

  // src/ts/screen/camera.ts
  var Camera = class {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.camerax = 1;
      this.cameray = 1;
    }
    moveCamera(targetx, targety) {
      let x = targetx - this.width / 2;
      let y = targety - this.height / 2;
      if (x == this.camerax && y == this.cameray) {
        return;
      }
      if (x < 0)
        x = 0;
      if (y < 0)
        y = 0;
      if (x > game.currentMap.width - this.width)
        x = game.currentMap.width - this.width;
      if (y > game.currentMap.height - this.height)
        y = game.currentMap.height - this.height;
      this.camerax = x;
      this.cameray = y;
    }
    toCameraCoordinates(x, y) {
      let newx = x - this.camerax;
      let newy = y - this.cameray;
      if (newx < 1 || newy < 1 || newx >= this.width + 1 || newy >= this.height + 1)
        return { _x: x, _y: y, inBounds: false };
      x = newx;
      y = newy;
      return { _x: x, _y: y, inBounds: true };
    }
    isInsideViewport(x, y) {
      if (x < 1 || y < 1 || x >= this.width + 1 || y >= this.height + 1)
        return false;
      return true;
    }
    getGlobalCoordinates(x, y) {
      if (x < 1 || y < 1 || x >= this.width + 1 || y >= this.height + 1)
        return { x, y, inBounds: false };
      x += this.camerax;
      y += this.cameray;
      return { _x: x, _y: y, inBounds: true };
    }
    getCamerax() {
      return this.camerax;
    }
    getCameray() {
      return this.cameray;
    }
    getWidth() {
      return this.width;
    }
    getHeight() {
      return this.height;
    }
  };

  // src/ts/screen/play_screen.ts
  var PlayScreen = class {
    constructor(width, height) {
      this.camera = new Camera(width, height);
    }
    render(x, y) {
      this.camera.moveCamera(x, y);
      this.drawMap();
      this.drawCorpses();
      this.drawActors();
      terminal.render();
    }
    drawMap() {
      for (let i = 0; i < this.camera.getWidth(); ++i) {
        for (let j = 0; j < this.camera.getHeight(); ++j) {
          let x = this.camera.getCamerax() + i;
          let y = this.camera.getCameray() + j;
          terminal.putChar(game.currentMap.getChar(x, y), i, j);
        }
      }
    }
    drawCorpses() {
    }
    drawActors() {
      const mapActors = game.currentMap.actors;
      for (const actor of mapActors) {
        const point = this.camera.toCameraCoordinates(actor.x, actor.y);
        if (point.inBounds) {
          terminal.putChar(actor.glyph, point._x, point._y);
        }
      }
    }
    getKeyAction(inputKey2) {
      if (inputKey2 === InputKey.NO_INPUT) {
        return null;
      }
      if (inputKey2 === InputKey.MN) {
        return new WalkAction(0, -1);
      }
      if (inputKey2 === InputKey.MS) {
        return new WalkAction(0, 1);
      }
      if (inputKey2 === InputKey.MW) {
        return new WalkAction(-1, 0);
      }
      if (inputKey2 === InputKey.ME) {
        return new WalkAction(1, 0);
      }
      if (inputKey2 === InputKey.MNE) {
        return new WalkAction(1, -1);
      }
      if (inputKey2 === InputKey.MNW) {
        return new WalkAction(-1, -1);
      }
      if (inputKey2 === InputKey.MSE) {
        return new WalkAction(1, 1);
      }
      if (inputKey2 === InputKey.MSW) {
        return new WalkAction(-1, 1);
      }
      if (inputKey2 === InputKey.SKIP) {
        return new RestAction();
      }
      return null;
    }
  };

  // src/ts/actor/actor.ts
  var Actor = class {
    constructor(x, y, breed, behavior) {
      this.x = x;
      this.y = y;
      this.blocks = true;
      this.breed = breed;
      this.behavior = behavior;
      this.hp = this.breed.maxHp;
    }
    get maxHp() {
      return this.breed.maxHp;
    }
    get glyph() {
      return this.breed.glyph;
    }
    get attack() {
      return this.breed.attack;
    }
    get defense() {
      return this.breed.defense;
    }
    get isPlayer() {
      return this.breed.isPlayer;
    }
  };

  // src/ts/actor/breed.ts
  var Breed = class {
    //(name: string, glyph: Glyph, maxHp: number, attack: number, defense: number, isPlayer: boolean)
    constructor(type) {
      this.name = type.name;
      this.glyph = type.glyph;
      this.maxHp = type.maxHp;
      this.attack = type.attack;
      this.defense = type.defense;
      this.isPlayer = type.isPlayer;
    }
  };

  // src/ts/storage/actor_storage.ts
  var ActorStorage = class {
    static defineActors() {
      this.definedTypes = [
        {
          name: "you",
          glyph: terminal.defineGlyph("@", Color.white, Color.black),
          maxHp: 30,
          attack: 10,
          defense: 5,
          isPlayer: true
        },
        {
          name: "dragon",
          glyph: terminal.defineGlyph("D", Color.yellow, Color.black),
          maxHp: 15,
          attack: 5,
          defense: 0,
          isPlayer: false
        }
      ];
    }
    static getBreed(type) {
      for (let i = 0; i < this.definedTypes.length; ++i) {
        if (i === type) {
          return new Breed(this.definedTypes[i]);
        }
      }
      return null;
    }
    static makeActor(x, y, type, behaviour) {
      const breed = this.getBreed(type);
      if (!breed) {
        throw new TypeError(`breed:${type} is not defined`);
      }
      return new Actor(x, y, breed, behaviour);
    }
  };
  ActorStorage.definedTypes = [];

  // src/ts/map/tile.ts
  var Tile = class {
    // sync image src load
    static defineTiles() {
      this.GRASS = new Tile(terminal.defineGlyph(".", Color.green, Color.black), false);
      this.WALL = new Tile(terminal.defineGlyph("#", Color.grey, Color.black), true);
      this.BOUND = new Tile(terminal.defineGlyph("X", Color.red, Color.black), true);
      console.log("tiles defined");
    }
    constructor(glyph, blocks) {
      this._glyph = glyph;
      this._blocks = blocks;
    }
    get glyph() {
      return this._glyph;
    }
    get blocks() {
      return this._blocks;
    }
  };

  // src/ts/map/map.ts
  var GameMap = class {
    constructor(width, height, tiles, actors) {
      this._tiles = [];
      this._actors = [];
      this._corpses = [];
      this._width = width;
      this._height = height;
      this._tiles = tiles;
      this._actors = actors;
    }
    isInsideMap(x, y) {
      if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        return false;
      }
      return true;
    }
    addActor(actor) {
      this._actors.push(actor);
    }
    actorDied(actor) {
      for (let i = 0, len = this._actors.length; i < len; ++i) {
        if (this._actors[i] === actor) {
          this._corpses.push(actor);
          this._actors.splice(i, 1);
          return;
        }
      }
    }
    isWall(x, y) {
      if (this.isInsideMap(x, y) && this._tiles[x + y * this._width].blocks) {
        return true;
      }
      return false;
    }
    getChar(x, y) {
      if (this.isInsideMap(x, y)) {
        return this._tiles[x + y * this._width].glyph;
      }
      return Tile.BOUND.glyph;
    }
    getColor(x, y) {
      if (this.isInsideMap(x, y)) {
        return this._tiles[x + y * this._width].glyph.fcol;
      }
      return Color.red;
    }
    get width() {
      return this._width;
    }
    get height() {
      return this._height;
    }
    get actors() {
      return this._actors;
    }
    get corpses() {
      return this._corpses;
    }
  };

  // src/ts/map/map_builder.ts
  var MapBuilder = class {
    constructor(width, height, depth) {
      this.tiles = [];
      this.actors = [];
      this.width = width;
      this.height = height;
      this.tiles = new Array(width * height);
      this.depth = depth;
    }
    addActors(amount) {
      for (let i = 0; i < amount; ++i) {
        let x;
        let y;
        do {
          x = Math.floor(Math.random() * this.width);
          y = Math.floor(Math.random() * this.height);
        } while (this.tiles[x + y * this.width].blocks);
        this.actors.push(ActorStorage.makeActor(x, y, 1 /* dragon */, null));
      }
    }
    populate(precision, populateWith) {
      for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
          this.tiles[i + j * this.width] = Math.random() < precision ? populateWith : Tile.GRASS;
        }
      }
      console.log("map populated");
    }
    addBoundaries() {
      for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
          if (i == 0 || i == this.width - 1 || j == 0 || j == this.height - 1) {
            this.tiles[i + j * this.width] = Tile.BOUND;
          }
        }
      }
    }
    makeMap() {
      this.populate(0.05, Tile.WALL);
      this.addActors(25);
      this.addBoundaries();
      return new GameMap(this.width, this.height, this.tiles, this.actors);
    }
  };

  // src/ts/main.ts
  var InputKey = {
    NO_INPUT: "",
    MN: "(0,-1)",
    MS: "(0,1)",
    MW: "(-1,0)",
    ME: "(1,0)",
    MNE: "(1,-1)",
    MNW: "(-1,-1)",
    MSE: "(1,1)",
    MSW: "(-1,1)",
    SKIP: "skip",
    PICKUP: "pickup"
  };
  var inputKey = InputKey.NO_INPUT;
  var screenWidth = 50;
  var screenHeight = 50;
  var Game = class {
    constructor() {
      this.loop = (timestamp) => {
        let progress = timestamp - this.lastRender;
        this.update();
        this.lastRender = timestamp;
        window.requestAnimationFrame(this.loop);
      };
      this.sightRadius = 8;
      this.lastRender = 0;
      this.currentMap = new MapBuilder(150, 150, 1).makeMap();
      this.player = ActorStorage.makeActor(25, 25, 0 /* player */, null);
      this.currentScreen = new PlayScreen(screenWidth, screenHeight);
      this.currentMap.addActor(this.player);
      console.log("Game constructor");
      window.requestAnimationFrame(this.loop);
    }
    update() {
      let action = this.currentScreen.getKeyAction(inputKey);
      if (action) {
        let result = action.perform(this.player);
        while (result.altAction) {
          action = result.altAction;
          result = action.perform(this.player);
        }
        if (result.altAction) {
        }
        if (result.moved) {
        }
        if (result.performed) {
        }
      }
      inputKey = InputKey.NO_INPUT;
      this.currentScreen.render(this.player.x, this.player.y);
    }
  };
  var terminal = new Terminal(screenWidth, screenHeight, "data/cp437_16x16.png", 16, 16);
  var game;
  document.addEventListener("imgLoaded", initGame.bind(void 0));
  function initGame(e) {
    console.log("imgLoaded event");
    Tile.defineTiles();
    ActorStorage.defineActors();
    game = new Game();
    document.removeEventListener("imgLoaded", initGame);
    document.addEventListener("keydown", kbInput, false);
  }
  function kbInput(e) {
    switch (e.key) {
      case "ArrowUp":
      case "w":
        e.preventDefault();
        inputKey = InputKey.MN;
        break;
      case "ArrowDown":
      case "s":
        e.preventDefault();
        inputKey = InputKey.MS;
        break;
      case "ArrowLeft":
      case "a":
        e.preventDefault();
        inputKey = InputKey.MW;
        break;
      case "ArrowRight":
      case "d":
        e.preventDefault();
        inputKey = InputKey.ME;
        break;
      case "Home":
      case "q":
        e.preventDefault();
        inputKey = InputKey.MNW;
        break;
      case "PageUp":
      case "e":
        e.preventDefault();
        inputKey = InputKey.MNE;
        break;
      case "End":
      case "z":
        e.preventDefault();
        inputKey = InputKey.MSW;
        break;
      case "PageDown":
      case "c":
        e.preventDefault();
        inputKey = InputKey.MSE;
        break;
      case " ":
        e.preventDefault();
        if (e.code == "Space" || e.keyCode == 32) {
          inputKey = InputKey.SKIP;
        }
        break;
      default:
        break;
    }
  }
})();
