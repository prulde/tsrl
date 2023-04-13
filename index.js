"use strict";
(() => {
  // src/ts/termial/color.ts
  var _Color = class {
    /** 
     * @param color - initial color
     * @param factor - float number
     * @returns a new Color that is darker than the initial color
     */
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
      _Color.colors.push(this);
    }
  };
  var Color = _Color;
  /**
   * list of all colors, including user-defined
   */
  Color.colors = [];
  Color.black = new _Color(0, 0, 0);
  //public static readonly gray = new Color(0, 0, 0);
  Color.darkestGrey = new _Color(31, 31, 31);
  Color.darkerGrey = new _Color(63, 63, 63);
  Color.darkGrey = new _Color(95, 95, 95);
  Color.grey = new _Color(127, 127, 127);
  Color.lightGrey = new _Color(159, 159, 159);
  Color.lighterGrey = new _Color(191, 191, 191);
  Color.lightestGrey = new _Color(223, 223, 223);
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

  // src/ts/termial/terminal.ts
  var Terminal = class {
    constructor(width, height, tilesetUrl, stepx, stepy) {
      this.cachedFonts = /* @__PURE__ */ new Map();
      this.glyphs = [];
      this.changedGlyphs = [];
      this.width = width;
      this.height = height;
      this.stepx = stepx;
      this.stepy = stepy;
      this.widthPixels = width * stepx;
      this.heightPixels = height * stepy;
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.widthPixels;
      this.canvas.height = this.heightPixels;
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d", { alpha: false, willReadFrequently: true });
      this.ctx.imageSmoothingEnabled = false;
      this.imgLoaded = new CustomEvent("imgLoaded");
      this.tileset = new Image();
      this.tileset.onload = () => this.tilesetLoaded();
      this.tileset.src = tilesetUrl;
    }
    makeColoredCanvas(fontColor) {
      let canvas = document.createElement("canvas");
      canvas.width = this.widthPixels;
      canvas.height = this.heightPixels;
      let ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(this.tileset, 0, 0);
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "rgb(" + fontColor.r + ", " + fontColor.g + ", " + fontColor.b + ")";
      ctx.fillRect(0, 0, this.stepx * 16, this.stepy * 16);
      return canvas;
    }
    tilesetLoaded() {
      Color.colors.forEach((color) => {
        this.cachedFonts.set(color, this.makeColoredCanvas(color));
      });
      document.dispatchEvent(this.imgLoaded);
    }
    /** fills the terminal with black color */
    clear() {
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.widthPixels, this.heightPixels);
    }
    /**
     * Writes one glyph to [x, y]
     */
    putChar(glyph, x, y) {
      if (x < 0 || x > this.width)
        throw new RangeError(`x:${x} must be within range [0,${this.width}]`);
      if (y < 0 || y > this.height)
        throw new RangeError(`y:${y} must be within range [0,${this.height}]`);
      this.changedGlyphs[x + y * this.width] = glyph;
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
    /** Renders only modified glyphs since the last call. */
    render() {
      for (let x = 0; x < this.width; ++x) {
        for (let y = 0; y < this.height; ++y) {
          let glyph = this.changedGlyphs[x + y * this.width];
          if (glyph === null || glyph === void 0)
            continue;
          if (this.changedGlyphs[x + y * this.width] == this.glyphs[x + y * this.width])
            continue;
          let char = glyph.char;
          let sx = Math.floor(char % this.stepx) * this.stepx;
          let sy = Math.floor(char / this.stepx) * this.stepy;
          this.ctx.fillStyle = "rgb(" + glyph.bcol.r + ", " + glyph.bcol.g + ", " + glyph.bcol.b + ")";
          this.ctx.fillRect(x * this.stepx, y * this.stepy, this.stepx, this.stepy);
          let color = this.cachedFonts.get(glyph.fcol);
          if (color === void 0) {
            throw new TypeError(`${glyph.fcol} is undefined`);
          }
          this.ctx.drawImage(color, sx, sy, this.stepx, this.stepy, x * this.stepx, y * this.stepy, this.stepx, this.stepy);
          this.glyphs[x + y * this.width] = glyph;
          this.changedGlyphs[x + y * this.width] = null;
        }
      }
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
      if (game.noCollision) {
        owner.x += this.x;
        owner.y += this.y;
        return new ActionResult(true, true, null, null);
      }
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

  // src/ts/termial/glyph.ts
  var Glyph = class {
    constructor(glyph, fcolor, bcolor) {
      if (typeof glyph === "string") {
        glyph = glyph.charCodeAt(0);
      }
      ;
      this._glyph = glyph;
      this._fcolor = fcolor;
      this._bcolor = bcolor;
    }
    get fcol() {
      return this._fcolor;
    }
    get bcol() {
      return this._bcolor;
    }
    get char() {
      return this._glyph;
    }
  };

  // src/ts/map/tile.ts
  var _Tile = class {
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
  var Tile = _Tile;
  Tile.GRASS = new _Tile(new Glyph(".", Color.green, Color.black), false);
  Tile.WALL = new _Tile(new Glyph("#", Color.grey, Color.black), true);
  // dont delete
  Tile.FOG = new _Tile(new Glyph("#", Color.black, Color.black), false);
  Tile.BOUND = new _Tile(new Glyph("X", Color.red, Color.black), true);
  Tile.FLOOR = new _Tile(new Glyph(".", Color.grey, Color.black), false);
  Tile.DOOR = new _Tile(new Glyph("+", Color.amber, Color.black), false);
  Tile.OPEN_DOOR = new _Tile(new Glyph("/", Color.amber, Color.black), false);
  Tile.TEST_DOOR = new _Tile(new Glyph("#", new Color(150, 80, 0), Color.black), true);
  Tile.TEST_WALL = new _Tile(new Glyph("#", new Color(0, 120, 0), Color.black), true);
  Tile.TEST_FLOOR = new _Tile(new Glyph("#", Color.darkestGrey, Color.black), false);

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
      if (newx < 0 || newy < 0 || newx >= this.width || newy >= this.height)
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
          if (game.noFov) {
            terminal.putChar(game.currentMap.getChar(x, y), i, j);
            continue;
          }
          if (game.currentMap.isInFov(x, y)) {
            terminal.putChar(game.currentMap.getChar(x, y), i, j);
          } else if (game.currentMap.isExplored(x, y)) {
            terminal.putChar(Tile.FOG.glyph, i, j);
          } else {
            terminal.putChar(Tile.FOG.glyph, i, j);
          }
        }
      }
    }
    drawCorpses() {
    }
    drawActors() {
      const mapActors = game.currentMap.actors;
      for (const actor of mapActors) {
        const point = this.camera.toCameraCoordinates(actor.x, actor.y);
        if (game.noFov && point.inBounds) {
          terminal.putChar(actor.glyph, point._x, point._y);
          continue;
        }
        if (game.currentMap.isInFov(actor.x, actor.y)) {
          if (point.inBounds) {
            terminal.putChar(actor.glyph, point._x, point._y);
          } else {
            terminal.putChar(Tile.FOG.glyph, point._x, point._y);
          }
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
  ActorStorage.definedTypes = [
    {
      name: "you",
      glyph: new Glyph("@", Color.white, Color.black),
      maxHp: 30,
      attack: 10,
      defense: 5,
      isPlayer: true
    },
    {
      name: "dragon",
      glyph: new Glyph("D", Color.yellow, Color.black),
      maxHp: 15,
      attack: 5,
      defense: 0,
      isPlayer: false
    }
  ];

  // src/ts/map/fov.ts
  var Point = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  };
  var Quadrant = class {
    constructor(sector, origin) {
      this.sector = sector;
      this.origin = origin;
    }
    transfom(tile) {
      if (this.sector == 0) {
        return new Point(this.origin.x + tile.x, this.origin.y - tile.y);
      } else if (this.sector == 2) {
        return new Point(this.origin.x + tile.x, this.origin.y + tile.y);
      } else if (this.sector == 1) {
        return new Point(this.origin.x + tile.y, this.origin.y + tile.x);
      } else {
        return new Point(this.origin.x - tile.y, this.origin.y + tile.x);
      }
    }
  };
  var Row = class {
    constructor(depth, startSlope, endSlope) {
      this.depth = depth;
      this.startSlope = startSlope;
      this.endSlope = endSlope;
    }
    rowTiles() {
      let tiles = new Array();
      let minCol = Math.floor(this.depth * this.startSlope + 0.5);
      let maxCol = Math.ceil(this.depth * this.endSlope - 0.5);
      for (let x = minCol; x < maxCol + 1; ++x) {
        tiles.push(new Point(x, this.depth));
      }
      return tiles;
    }
    nextRow() {
      return new Row(this.depth + 1, this.startSlope, this.endSlope);
    }
  };
  var Fov = class {
    constructor(width, height, map) {
      this.width = width;
      this.height = height;
      this.inFov = new Array();
      this.explored = new Array(width * height);
      this.range = 10;
      this.radius = this.range * this.range;
      this.map = map;
      this.explored.fill(false);
    }
    isInFov(x, y) {
      let value = false;
      this.inFov.forEach((p) => {
        if (p.x == x && p.y == y) {
          value = true;
          return;
        }
      });
      return value;
    }
    isExplored(x, y) {
      return this.explored[x + y * this.width];
    }
    computeFov(x, y) {
      this.inFov = [];
      this.inFov.push(new Point(x, y));
      for (let i = 0; i < 4; ++i) {
        let q = new Quadrant(i, new Point(x, y));
        this.scan(new Row(1, -1, 1), q);
      }
    }
    scan(row, q) {
      if (row.depth > this.range - 1) {
        return;
      }
      if (row.startSlope >= row.endSlope) {
        return;
      }
      let prevTile = null;
      row.rowTiles().forEach((tile) => {
        if (Math.pow(tile.x, 2) + Math.pow(tile.y, 2) > this.radius) {
          return;
        }
        if (this.isWall(tile, q) || this.isSymmetric(row, tile)) {
          this.reveal(tile, q);
        }
        if (prevTile) {
          if (this.isWall(prevTile, q) && !this.isWall(tile, q)) {
            row.startSlope = this.slope(tile, q);
          }
          if (!this.isWall(prevTile, q) && this.isWall(tile, q)) {
            let nextRow = row.nextRow();
            nextRow.endSlope = this.slope(tile, q);
            this.scan(nextRow, q);
          }
        }
        prevTile = tile;
      });
      if (prevTile) {
        if (!this.isWall(prevTile, q)) {
          this.scan(row.nextRow(), q);
        }
      }
    }
    reveal(tile, q) {
      let converted = q.transfom(tile);
      if (!this.map.isInsideMap(converted.x, converted.y)) {
        return;
      }
      this.inFov.push(new Point(converted.x, converted.y));
      this.explored[converted.x + converted.y * this.width] = true;
    }
    isWall(tile, q) {
      let converted = q.transfom(tile);
      if (!this.map.isInsideMap(converted.x, converted.y)) {
        return true;
      }
      return this.map.isWall(converted.x, converted.y);
    }
    slope(tile, q) {
      return (2 * tile.x - 1) / (2 * tile.y);
    }
    isSymmetric(row, tile) {
      return tile.x >= row.depth * row.startSlope && tile.x <= row.depth * row.endSlope;
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
      this.fov = new Fov(width, height, this);
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
    computeFov(x, y) {
      this.fov.computeFov(x, y);
    }
    isInFov(x, y) {
      if (!this.isInsideMap(x, y)) {
        return false;
      }
      return this.fov.isInFov(x, y);
    }
    isExplored(x, y) {
      if (!this.isInsideMap(x, y)) {
        return false;
      }
      return this.fov.isExplored(x, y);
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

  // src/ts/utils/rng.ts
  var Rng = class {
    static randomInt(max, min = 0) {
      if (min == 0)
        return Math.round(Math.random() * (max - 1));
      else
        return Math.round(Math.random() * (max - min + 1) + min);
    }
    static randomBoolean(probability = 0.5) {
      return Math.random() > probability;
    }
  };

  // src/ts/map/generation/features.ts
  var _Direction = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  };
  var Direction = _Direction;
  Direction.north = new _Direction(0, -1);
  Direction.south = new _Direction(0, 1);
  Direction.west = new _Direction(-1, 0);
  Direction.east = new _Direction(1, 0);
  Direction.none = new _Direction(0, 0);
  Direction.cardinal = [_Direction.north, _Direction.south, _Direction.west, _Direction.east];
  var _AreaType = class {
  };
  var AreaType = _AreaType;
  AreaType.none = "none";
  AreaType.room = "room";
  AreaType.corridor = "corridor";
  AreaType.types = [_AreaType.room, _AreaType.corridor];
  var Mark = class {
    constructor(x, y, dir, masterAreaType) {
      this.forcedNextAreaType = AreaType.none;
      this.corridorEnd = false;
      this.x = x;
      this.y = y;
      this.dir = dir;
      this.masterAreaType = masterAreaType;
    }
  };
  var Room = class {
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.floorTiles = [];
      this.areaType = AreaType.none;
      this.exits = [];
      this.sameTypeForced = false;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  };
  var DungeonSettings = class {
    constructor(params) {
      let tempMap = /* @__PURE__ */ new Map();
      this.seq = /* @__PURE__ */ new Map();
      this.max = /* @__PURE__ */ new Map();
      for (let i in params) {
        tempMap.set(AreaType.types[i], params[i].chance);
        this.seq.set(AreaType.types[i], params[i].seq);
        this.max.set(AreaType.types[i], params[i].max);
      }
      this.chance = new Map([...tempMap.entries()].sort((a, b) => a[1] - b[1]));
    }
  };
  var FeatureBuilder = class {
    constructor(width, height, tiles, depth) {
      this.tiles = [];
      this.rooms = [];
      this.unusedExits = [];
      this.placeRoomAttempts = 500;
      this.resizeAndPlaceAttempts = 10;
      this.maxRooms = 50;
      this.width = width;
      this.height = height;
      this.tiles = tiles;
      this.depth = depth;
      this.settings = new DungeonSettings([
        { chance: 1, seq: 0, max: 0 },
        { chance: 0, seq: 0, max: 0 }
      ]);
    }
    generate() {
      this.initWithTiles(Tile.WALL);
      this.makeFirstRoom();
      this.maxRooms--;
      for (let i = 0; i < this.maxRooms; ++i) {
        if (!this.createFeatures()) {
          console.log("cant make more rooms");
          break;
        }
      }
      this.rooms.forEach((room) => {
        room.exits.forEach((exit) => {
          this.tiles[exit.x + exit.y * this.width] = Tile.TEST_DOOR;
        });
      });
      this.unusedExits.forEach((exit) => {
        this.tiles[exit.x + exit.y * this.width] = Tile.DOOR;
      });
    }
    // decide the shape of the room 
    createFeatures() {
      for (let i = 0; i < this.placeRoomAttempts; ++i) {
        let choice = Math.random();
        if (!this.unusedExits.length)
          return false;
        let exitInd = Rng.randomInt(this.unusedExits.length);
        let randomExit = this.unusedExits[exitInd];
        if (randomExit.forcedNextAreaType != AreaType.none) {
          this.unusedExits.splice(exitInd, 1);
          for (let j = 0; j < this.resizeAndPlaceAttempts; ++j)
            if (this.createRoomByType(randomExit.forcedNextAreaType, randomExit))
              return true;
        } else {
          for (let [areaType, chance] of this.settings.chance) {
            choice -= chance;
            if (choice <= 0) {
              this.unusedExits.splice(exitInd, 1);
              for (let j = 0; j < this.resizeAndPlaceAttempts; ++j)
                if (this.createRoomByType(areaType, randomExit))
                  return true;
            }
          }
        }
      }
      return false;
    }
    makeFirstRoom() {
      const minRoomSize = 6;
      const maxRoomSize = 12;
      let room = new Room();
      room.areaType = AreaType.room;
      room.width = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 2;
      room.height = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 2;
      room.floorTiles = new Array(this.width * this.height);
      room.x = Math.round(this.width / 2 - room.width / 2) - 1;
      room.y = Math.round(this.height / 2 - room.height / 2) - 1;
      for (let x = room.x; x < room.x + room.width; ++x) {
        for (let y = room.y; y < room.y + room.height; ++y) {
          if (x == room.x || x == room.x + room.width - 1 || y == room.y || y == room.y + room.height - 1) {
            room.floorTiles[x + y * this.width] = 1;
          } else {
            room.floorTiles[x + y * this.width] = 0;
          }
        }
      }
      room.exits.push(new Mark(Rng.randomInt(room.x + 3, room.x + room.width - 3), room.y, Direction.north, room.areaType));
      room.exits.push(new Mark(Rng.randomInt(room.x + 3, room.x + room.width - 3), room.y + room.height - 1, Direction.south, room.areaType));
      room.exits.push(new Mark(room.x, Rng.randomInt(room.y + 3, room.y + room.height - 3), Direction.west, room.areaType));
      room.exits.push(new Mark(room.x + room.width - 1, Rng.randomInt(room.y + 3, room.y + room.height - 3), Direction.east, room.areaType));
      this.addForcedType(room);
      room.exits.forEach((exit) => {
        room.floorTiles[exit.x + exit.y * this.width] = 2;
        this.unusedExits.push(exit);
      });
      this.placeRoom(room, Tile.TEST_FLOOR);
    }
    makeRectRoom(randomExit, firstRoom = false) {
      const minRoomSize = 4;
      const maxRoomSize = 14;
      let room = new Room();
      room.areaType = AreaType.room;
      room.width = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 2;
      room.height = Rng.randomInt(Math.round(minRoomSize / 2), Math.round(maxRoomSize / 2)) * 2 + 2;
      room.floorTiles = new Array(this.width * this.height);
      if (randomExit.dir == Direction.north) {
        room.x = Rng.randomInt(randomExit.x - Math.round(room.width / 2), randomExit.x - 3);
        room.y = randomExit.y - room.height + 1;
      } else if (randomExit.dir == Direction.south) {
        room.x = Rng.randomInt(randomExit.x - Math.round(room.width / 2), randomExit.x - 3);
        room.y = randomExit.y;
      } else if (randomExit.dir == Direction.west) {
        room.x = randomExit.x - room.width + 1;
        room.y = Rng.randomInt(randomExit.y - Math.round(room.height / 2), randomExit.y - 3);
      } else if (randomExit.dir == Direction.east) {
        room.x = randomExit.x;
        room.y = Rng.randomInt(randomExit.y - Math.round(room.height / 2), randomExit.y - 3);
      }
      for (let x = room.x; x < room.x + room.width; ++x) {
        for (let y = room.y; y < room.y + room.height; ++y) {
          if (x == room.x || x == room.x + room.width - 1 || y == room.y || y == room.y + room.height - 1) {
            room.floorTiles[x + y * this.width] = 1;
          } else {
            room.floorTiles[x + y * this.width] = 0;
          }
        }
      }
      if (randomExit.dir != Direction.south)
        room.exits.push(new Mark(Rng.randomInt(room.x + 3, room.x + room.width - 3), room.y, Direction.north, room.areaType));
      if (randomExit.dir != Direction.north)
        room.exits.push(new Mark(Rng.randomInt(room.x + 3, room.x + room.width - 3), room.y + room.height - 1, Direction.south, room.areaType));
      if (randomExit.dir != Direction.east)
        room.exits.push(new Mark(room.x, Rng.randomInt(room.y + 3, room.y + room.height - 3), Direction.west, room.areaType));
      if (randomExit.dir != Direction.west)
        room.exits.push(new Mark(room.x + room.width - 1, Rng.randomInt(room.y + 3, room.y + room.height - 3), Direction.east, room.areaType));
      this.addForcedType(room);
      if (this.canPlace(room)) {
        room.exits.forEach((exit) => {
          room.floorTiles[exit.x + exit.y * this.width] = 2;
          this.unusedExits.push(exit);
        });
        this.placeRoom(room, Tile.TEST_FLOOR);
        return true;
      }
      return false;
    }
    makeCorridor(randomExit) {
      const minCorridorLength = 3;
      const maxCorridorLength = 12;
      let corridor = new Room();
      corridor.areaType = AreaType.corridor;
      corridor.floorTiles = new Array(this.width * this.height);
      if (randomExit.dir == Direction.north) {
        corridor.x = randomExit.x - 1;
        corridor.y = randomExit.y - corridor.height + 1;
        corridor.width = 3;
        corridor.height = Rng.randomInt(Math.round(minCorridorLength / 2), Math.round(maxCorridorLength / 2)) * 2 + 1;
      } else if (randomExit.dir == Direction.south) {
        corridor.x = randomExit.x - 1;
        corridor.y = randomExit.y;
        corridor.width = 3;
        corridor.height = Rng.randomInt(Math.round(minCorridorLength / 2), Math.round(maxCorridorLength / 2)) * 2 + 1;
      } else if (randomExit.dir == Direction.west) {
        corridor.x = randomExit.x - corridor.width + 1;
        corridor.y = randomExit.y - 1;
        corridor.width = Rng.randomInt(Math.round(minCorridorLength / 2), Math.round(maxCorridorLength / 2)) * 2 + 1;
        corridor.height = 3;
      } else if (randomExit.dir == Direction.east) {
        corridor.x = randomExit.x;
        corridor.y = randomExit.y - 1;
        corridor.width = Rng.randomInt(Math.round(minCorridorLength / 2), Math.round(maxCorridorLength / 2)) * 2 + 1;
        corridor.height = 3;
      }
      for (let x = corridor.x; x < corridor.x + corridor.width; ++x) {
        for (let y = corridor.y; y < corridor.y + corridor.height; ++y) {
          if (x == corridor.x || x == corridor.x + corridor.width - 1 || y == corridor.y || y == corridor.y + corridor.height - 1) {
            corridor.floorTiles[x + y * this.width] = 1;
          } else {
            corridor.floorTiles[x + y * this.width] = 0;
          }
        }
      }
      if (randomExit.dir != Direction.south) {
        if (randomExit.dir == Direction.north)
          corridor.exits.push(new Mark(corridor.x + 1, corridor.y, Direction.north, corridor.areaType));
        else
          corridor.exits.push(new Mark(Rng.randomInt(corridor.x + 2, corridor.x + corridor.width - 2), corridor.y, Direction.north, corridor.areaType));
      }
      if (randomExit.dir != Direction.north) {
        if (randomExit.dir == Direction.south)
          corridor.exits.push(new Mark(corridor.x + 1, corridor.y + corridor.height - 1, Direction.north, corridor.areaType));
        else
          corridor.exits.push(new Mark(Rng.randomInt(corridor.x + 2, corridor.x + corridor.width - 2), corridor.y + corridor.height - 1, Direction.south, corridor.areaType));
      }
      if (randomExit.dir != Direction.east) {
        if (randomExit.dir == Direction.west)
          corridor.exits.push(new Mark(corridor.x, corridor.y + 1, Direction.west, corridor.areaType));
        else
          corridor.exits.push(new Mark(corridor.x, Rng.randomInt(corridor.y + 2, corridor.y + corridor.height - 2), Direction.west, corridor.areaType));
      }
      if (randomExit.dir != Direction.west) {
        if (randomExit.dir == Direction.east)
          corridor.exits.push(new Mark(corridor.x + corridor.width - 1, corridor.y + 1, Direction.east, corridor.areaType));
        else
          corridor.exits.push(new Mark(corridor.x + corridor.width - 1, Rng.randomInt(corridor.y + 2, corridor.y + corridor.height - 2), Direction.east, corridor.areaType));
      }
      this.addForcedType(corridor);
      if (this.canPlace(corridor)) {
        corridor.exits.forEach((exit) => {
          corridor.floorTiles[exit.x + exit.y * this.width] = 2;
          this.unusedExits.push(exit);
        });
        this.placeRoom(corridor, Tile.TEST_FLOOR);
        return true;
      }
      return false;
    }
    // compare area types and return corresponding room shape 
    createRoomByType(areaType, exit) {
      if (areaType == AreaType.room)
        return this.makeRectRoom(exit);
      else if (areaType == AreaType.corridor)
        return this.makeCorridor(exit);
      return false;
    }
    addForcedType(room) {
      let choice = Math.random();
      let sameTypeChance = this.settings.seq.get(room.areaType);
      if (sameTypeChance && choice <= sameTypeChance && !room.sameTypeForced) {
        room.sameTypeForced = true;
        room.exits[Rng.randomInt(room.exits.length)].forcedNextAreaType = room.areaType;
      }
    }
    canPlace(room) {
      if (room.x <= 1 || room.y <= 1 || room.x + room.width > this.width - 1 || room.y + room.height > this.height - 1)
        return false;
      for (let x = room.x; x < room.x + room.width; ++x) {
        for (let y = room.y; y < room.y + room.height; ++y) {
          if (this.tiles[x + y * this.width] == Tile.TEST_FLOOR && room.floorTiles[x + y * this.width] == 0 || this.tiles[x + y * this.width] == Tile.TEST_FLOOR && room.floorTiles[x + y * this.width] == 1)
            return false;
        }
      }
      return true;
    }
    // add room on the map 
    // private placeRoom(room: Room, tile: Tile): void {
    // 	for (let x: number = room.x; x < room.x + room.width; ++x) {
    // 		for (let y: number = room.y; y < room.y + room.height; ++y) {
    // 			if (room.floorTiles[(x - room.x) + (y - room.y) * room.width] == 0) {
    // 				this.tiles[x + y * this.width] = tile;
    // 			} else if (room.floorTiles[(x - room.x) + (y - room.y) * room.width] == 2) {
    // 				this.tiles[x + y * this.width] = Tile.TEST_DOOR;
    // 			} else if (room.floorTiles[(x - room.x) + (y - room.y) * room.width] == 1) {
    // 				this.tiles[x + y * this.width] = Tile.TEST_WALL;
    // 			}
    // 		}
    // 	}
    // 	this.unusedExits.forEach((exit) => {
    // 		this.tiles[exit.x + exit.y * this.width] = Tile.TEST_DOOR;
    // 	});
    // 	this.rooms.push(room);
    // }
    // add room on the map 
    placeRoom(room, tile) {
      for (let x = room.x; x < room.x + room.width; ++x) {
        for (let y = room.y; y < room.y + room.height; ++y) {
          if (room.floorTiles[x + y * this.width] == 0) {
            this.tiles[x + y * this.width] = tile;
          } else if (room.floorTiles[x + y * this.width] == 2) {
            this.tiles[x + y * this.width] = Tile.TEST_DOOR;
          } else if (room.floorTiles[x + y * this.width] == 1) {
            this.tiles[x + y * this.width] = Tile.TEST_WALL;
          }
        }
      }
      this.rooms.push(room);
    }
    initWithTiles(tile) {
      for (let i = 0; i < this.width; i++)
        for (let j = 0; j < this.height; j++)
          this.tiles[i + j * this.width] = tile;
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
    makeMap() {
      let tileMap = new FeatureBuilder(this.width, this.height, this.tiles, this.depth);
      tileMap.generate();
      return new GameMap(this.width, this.height, this.tiles, this.actors);
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
    initWithTiles(tile) {
      for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
          this.tiles[i + j * this.width] = tile;
        }
      }
    }
    populate(precision, populateWith) {
      for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
          this.tiles[i + j * this.width] = Math.random() < precision ? populateWith : Tile.GRASS;
        }
      }
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
  var screenWidth = 100;
  var screenHeight = 100;
  var Game = class {
    constructor() {
      // debug 
      this.noFov = true;
      this.noCollision = true;
      this.loop = (timestamp) => {
        let progress = timestamp - this.lastRender;
        this.update();
        this.lastRender = timestamp;
        window.requestAnimationFrame(this.loop);
      };
      this.sightRadius = 8;
      this.lastRender = 0;
      this.currentMap = new MapBuilder(100, 100, 1).makeMap();
      this.player = ActorStorage.makeActor(25, 25, 0 /* player */, null);
      this.currentScreen = new PlayScreen(screenWidth, screenHeight);
      this.currentMap.addActor(this.player);
      this.currentMap.computeFov(this.player.x, this.player.y);
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
          this.currentMap.computeFov(this.player.x, this.player.y);
        }
        if (result.performed) {
        }
      }
      inputKey = InputKey.NO_INPUT;
      this.currentScreen.render(this.player.x, this.player.y);
    }
  };
  var terminal = new Terminal(screenWidth, screenHeight, "data/cp437_16x16_test.png", 16, 16);
  var game;
  document.addEventListener("imgLoaded", initGame.bind(void 0));
  function initGame(e) {
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
