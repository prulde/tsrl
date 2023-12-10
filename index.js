"use strict";
(() => {
  // src/ts/engine/action/action.ts
  var ActionResult = class {
    constructor(performed, moved, altAction, altScreen) {
      this._performed = performed;
      this._moved = moved;
      this._altAction = altAction;
      this._altScreen = altScreen;
    }
    get performed() {
      return this._performed;
    }
    get moved() {
      return this._moved;
    }
    get altAction() {
      return this._altAction;
    }
    get altScreen() {
      return this._altScreen;
    }
  };
  var Action = class {
  };

  // src/ts/engine/utils/position.ts
  var Position = class {
    constructor(x, y) {
      this._x = x;
      this._y = y;
    }
    static add(a, b) {
      return new Position(a.x + b.x, a.y + b.y);
    }
    static mul(a, b) {
      return new Position(a.x * b.x, a.y * b.y);
    }
    static from(position) {
      return new Position(position.x, position.y);
    }
    equals(position) {
      if (this._x === position.x && this._y === position.y)
        return true;
      return false;
    }
    get x() {
      return this._x;
    }
    get y() {
      return this._y;
    }
  };

  // src/ts/engine/actor/actor.ts
  var Actor = class {
    constructor(x, y, glyph) {
      this._position = new Position(x, y);
      this._glyph = glyph;
      this._blocks = true;
      this._hp = 0;
    }
    get position() {
      return this._position;
    }
    get glyph() {
      return this._glyph;
    }
    get blocks() {
      return this._blocks;
    }
    get hp() {
      return this._hp;
    }
    set position(pos) {
      this._position = pos;
    }
    set glyph(glyph) {
      this._glyph = glyph;
    }
    set blocks(blocks) {
      this._blocks = blocks;
    }
    set hp(hp) {
      this._hp = hp;
    }
  };

  // src/ts/engine/render/color.ts
  var _Color = class {
    constructor(r, g, b) {
      this.r = r;
      this.g = g;
      this.b = b;
      _Color.colors.push(this);
    }
    /** 
     * @param color - initial color
     * @param factor - float number (% of original color)
     * @returns a new Color that is darker than the original color
     */
    static makeDarker(color, factor) {
      return new _Color(
        Math.max(Math.floor(color.r * factor), 0),
        Math.max(Math.floor(color.g * factor), 0),
        Math.max(Math.floor(color.b * factor), 0)
      );
    }
  };
  var Color = _Color;
  Color.colors = [];
  Color.black = new _Color(0, 0, 0);
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

  // src/ts/engine/level/fov.ts
  function computeFov(level, position, range, fov) {
    switch (fov) {
      case 0 /* RecursiveShadowcasting */:
        computeFovRecursiveShadowcasting(level, position, range);
        break;
      default:
        break;
    }
  }
  var Quadrant = class {
    constructor(sector, origin) {
      this.sector = sector;
      this.origin = origin;
    }
    transform(tile) {
      if (this.sector == 0) {
        return new Position(this.origin.x + tile.x, this.origin.y - tile.y);
      } else if (this.sector == 2) {
        return new Position(this.origin.x + tile.x, this.origin.y + tile.y);
      } else if (this.sector == 1) {
        return new Position(this.origin.x + tile.y, this.origin.y + tile.x);
      } else {
        return new Position(this.origin.x - tile.y, this.origin.y + tile.x);
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
        tiles.push(new Position(x, this.depth));
      }
      return tiles;
    }
    nextRow() {
      return new Row(this.depth + 1, this.startSlope, this.endSlope);
    }
  };
  function computeFovRecursiveShadowcasting(level, position, range) {
    let radius = Math.pow(range, 2);
    level.reveal(Position.from(position));
    for (let i = 0; i < 4; ++i) {
      let q = new Quadrant(i, Position.from(position));
      scan(new Row(1, -1, 1), q, level, range, radius);
    }
  }
  function scan(row, q, level, range, radius) {
    if (row.depth > range - 1) {
      return;
    }
    if (row.startSlope >= row.endSlope) {
      return;
    }
    let prevTile = null;
    row.rowTiles().forEach((tile) => {
      if (Math.pow(tile.x, 2) + Math.pow(tile.y, 2) > radius) {
        return;
      }
      let currentTileBlocked = level.blocks(q.transform(tile));
      if (currentTileBlocked || isSymmetric(row, tile)) {
        level.reveal(q.transform(tile));
      }
      if (prevTile) {
        let prevTileBlocked = level.blocks(q.transform(prevTile));
        if (prevTileBlocked && !currentTileBlocked) {
          row.startSlope = slope(tile, q);
        }
        if (!prevTileBlocked && currentTileBlocked) {
          let nextRow = row.nextRow();
          nextRow.endSlope = slope(tile, q);
          scan(nextRow, q, level, range, radius);
        }
      }
      prevTile = tile;
    });
    if (prevTile) {
      let prevTileBlocked = level.blocks(q.transform(prevTile));
      if (!prevTileBlocked) {
        scan(row.nextRow(), q, level, range, radius);
      }
    }
  }
  function slope(tile, q) {
    return (2 * tile.x - 1) / (2 * tile.y);
  }
  function isSymmetric(row, tile) {
    return tile.x >= row.depth * row.startSlope && tile.x <= row.depth * row.endSlope;
  }

  // src/ts/engine/render/glyph.ts
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

  // src/ts/engine/level/tile.ts
  var _Tile = class {
    constructor(glyph, blocks) {
      this._explored = false;
      this._glyph = glyph;
      this._tintedGlyph = new Glyph(this._glyph.char, Color.makeDarker(this._glyph.fcol, 0.5), this._glyph.bcol);
      this._blocks = blocks;
    }
    get glyph() {
      return this._glyph;
    }
    get tintedGlyph() {
      return this._tintedGlyph;
    }
    get blocks() {
      return this._blocks;
    }
    get explored() {
      return this._explored;
    }
    set explored(explored) {
      this._explored = explored;
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

  // src/ts/engine/level/level.ts
  var Level = class {
    constructor(width, height, tiles, actors) {
      this._tiles = [];
      this._inFov = [];
      this._actors = [];
      this._corpses = [];
      this._width = width;
      this._height = height;
      this._tiles = tiles;
      this._actors = actors;
    }
    isInsideMap(position) {
      if (position.x < 0 || position.x >= this._width || position.y < 0 || position.y >= this._height) {
        return false;
      }
      return true;
    }
    isExplored(position) {
      if (!this.isInsideMap(position)) {
        return false;
      }
      return this._tiles[position.x + position.y * this.width].explored;
    }
    computeFov(position, sightRadius, fov) {
      this._inFov = [];
      computeFov(this, position, sightRadius + 1, fov);
    }
    // fov map
    blocks(position) {
      if (this.isInsideMap(position) && this._tiles[position.x + position.y * this._width].blocks) {
        return true;
      }
      return false;
    }
    reveal(position) {
      if (!this.isInsideMap(position)) {
        return false;
      }
      this._tiles[position.x + position.y * this.width].explored = true;
      this._inFov.push(position);
      return true;
    }
    isInFov(position) {
      if (!this.isInsideMap(position)) {
        return false;
      }
      let value = false;
      this._inFov.forEach((p) => {
        if (p.x == position.x && p.y == position.y) {
          value = true;
          return;
        }
      });
      return value;
    }
    addActor(actor) {
      this._actors.push(actor);
    }
    // public containsActor(x: number, y: number): Actor | null {
    // 	for (const actor of this._actors) {
    // 		if (actor.blocks && actor.x === x && actor.y === y) {
    // 			return actor;
    // 		}
    // 	}
    // 	return null;
    // }
    getChar(pos) {
      if (this.isInsideMap(pos)) {
        return this._tiles[pos.x + pos.y * this._width].glyph;
      }
      return Tile.BOUND.glyph;
    }
    getColor(pos) {
      if (this.isInsideMap(pos)) {
        return this._tiles[pos.x + pos.y * this._width].glyph.fcol;
      }
      return Color.red;
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

  // src/ts/engine/utils/rng.ts
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

  // src/ts/engine/level/generation/features.ts
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
    //12,4
    constructor(width, height, tiles, depth) {
      this.tiles = [];
      this.rooms = [];
      this.doors = [];
      this.unusedExits = [];
      // this makes nices
      // private placeRoomAttempts: number = 500;
      // private resizeAndPlaceAttempts: number = 50;
      // private maxRooms: number = 100;
      // private minRoomSize: number = 4;//6;
      // private maxRoomSize: number = 8;//12;
      // private minCorridorLength: number = 3;
      // private maxCorridorLength: number = 12;//12
      // constructor(width: number, height: number, tiles: Tile[], depth: number) {
      // 	this.width = width;
      // 	this.height = height;
      // 	this.tiles = tiles;
      // 	this.depth = depth;
      // 	/** @see AreaType.types  */
      // 	this.settings = new DungeonSettings([
      // 		{ chance: 0.3, seq: 0.0, max: 0 },
      // 		{ chance: 0.7, seq: 1.0, max: 0 }
      // 	]);
      // }
      this.placeRoomAttempts = 500;
      this.resizeAndPlaceAttempts = 50;
      // 10
      this.maxRooms = 100;
      this.minRoomSize = 4;
      //6;
      this.maxRoomSize = 10;
      //12; 14 - too big?
      this.minCorridorLength = 3;
      this.maxCorridorLength = 6;
      this.width = width;
      this.height = height;
      this.tiles = tiles;
      this.depth = depth;
      this.settings = new DungeonSettings([
        { chance: 0.3, seq: 0, max: 0 },
        { chance: 0.7, seq: 0.7, max: 0 }
      ]);
    }
    generate() {
      this.initWithTiles(Tile.WALL);
      this.makeFirstRoom();
      this.maxRooms--;
      for (let i = 0; i < this.maxRooms; ++i) {
        if (!this.createFeatures()) {
          console.log(`rooms created:${this.rooms.length}, cant place more`);
          break;
        }
      }
      this.doors.forEach((door) => {
        this.tiles[door.x + door.y * this.width] = Tile.TEST_DOOR;
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
            if (this.createRoomByType(randomExit.forcedNextAreaType, randomExit)) {
              this.doors.push(randomExit);
              return true;
            }
        } else {
          for (let [areaType, chance] of this.settings.chance) {
            choice -= chance;
            if (choice <= 0) {
              this.unusedExits.splice(exitInd, 1);
              for (let j = 0; j < this.resizeAndPlaceAttempts; ++j)
                if (this.createRoomByType(areaType, randomExit)) {
                  this.doors.push(randomExit);
                  return true;
                }
            }
          }
        }
      }
      return false;
    }
    makeFirstRoom() {
      let room = new Room();
      room.areaType = AreaType.room;
      room.width = Rng.randomInt(Math.round(this.minRoomSize / 2), Math.round(this.maxRoomSize / 2)) * 2 + 2;
      room.height = Rng.randomInt(Math.round(this.minRoomSize / 2), Math.round(this.maxRoomSize / 2)) * 2 + 2;
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
      let room = new Room();
      room.areaType = AreaType.room;
      room.width = Rng.randomInt(Math.round(this.minRoomSize / 2), Math.round(this.maxRoomSize / 2)) * 2 + 2;
      room.height = Rng.randomInt(Math.round(this.minRoomSize / 2), Math.round(this.maxRoomSize / 2)) * 2 + 2;
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
      if (!this.canPlace(room))
        return false;
      room.exits.forEach((exit) => {
        room.floorTiles[exit.x + exit.y * this.width] = 2;
        this.unusedExits.push(exit);
      });
      this.placeRoom(room, Tile.TEST_FLOOR);
      return true;
    }
    makeCorridor(randomExit) {
      let corridor = new Room();
      corridor.areaType = AreaType.corridor;
      corridor.floorTiles = new Array(this.width * this.height);
      if (randomExit.dir == Direction.north) {
        corridor.width = 3;
        corridor.height = Rng.randomInt(Math.round(this.minCorridorLength / 2), Math.round(this.maxCorridorLength / 2)) * 2 + 1;
        corridor.x = randomExit.x - 1;
        corridor.y = randomExit.y - corridor.height + 1;
      } else if (randomExit.dir == Direction.south) {
        corridor.width = 3;
        corridor.height = Rng.randomInt(Math.round(this.minCorridorLength / 2), Math.round(this.maxCorridorLength / 2)) * 2 + 1;
        corridor.x = randomExit.x - 1;
        corridor.y = randomExit.y;
      } else if (randomExit.dir == Direction.west) {
        corridor.width = Rng.randomInt(Math.round(this.minCorridorLength / 2), Math.round(this.maxCorridorLength / 2)) * 2 + 1;
        corridor.height = 3;
        corridor.x = randomExit.x - corridor.width + 1;
        corridor.y = randomExit.y - 1;
      } else if (randomExit.dir == Direction.east) {
        corridor.width = Rng.randomInt(Math.round(this.minCorridorLength / 2), Math.round(this.maxCorridorLength / 2)) * 2 + 1;
        corridor.height = 3;
        corridor.x = randomExit.x;
        corridor.y = randomExit.y - 1;
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
      let exitForRoom = null;
      if (randomExit.dir != Direction.south) {
        if (randomExit.dir == Direction.north) {
          corridor.exits.push(new Mark(corridor.x + 1, corridor.y, Direction.north, corridor.areaType));
          exitForRoom = corridor.exits[corridor.exits.length - 1];
        } else
          corridor.exits.push(new Mark(Rng.randomInt(corridor.x + 3, corridor.x + corridor.width - 3), corridor.y, Direction.north, corridor.areaType));
      }
      if (randomExit.dir != Direction.north) {
        if (randomExit.dir == Direction.south) {
          corridor.exits.push(new Mark(corridor.x + 1, corridor.y + corridor.height - 1, Direction.south, corridor.areaType));
          exitForRoom = corridor.exits[corridor.exits.length - 1];
        } else
          corridor.exits.push(new Mark(Rng.randomInt(corridor.x + 3, corridor.x + corridor.width - 3), corridor.y + corridor.height - 1, Direction.south, corridor.areaType));
      }
      if (randomExit.dir != Direction.east) {
        if (randomExit.dir == Direction.west) {
          corridor.exits.push(new Mark(corridor.x, corridor.y + 1, Direction.west, corridor.areaType));
          exitForRoom = corridor.exits[corridor.exits.length - 1];
        } else
          corridor.exits.push(new Mark(corridor.x, Rng.randomInt(corridor.y + 3, corridor.y + corridor.height - 3), Direction.west, corridor.areaType));
      }
      if (randomExit.dir != Direction.west) {
        if (randomExit.dir == Direction.east) {
          corridor.exits.push(new Mark(corridor.x + corridor.width - 1, corridor.y + 1, Direction.east, corridor.areaType));
          exitForRoom = corridor.exits[corridor.exits.length - 1];
        } else
          corridor.exits.push(new Mark(corridor.x + corridor.width - 1, Rng.randomInt(corridor.y + 3, corridor.y + corridor.height - 3), Direction.east, corridor.areaType));
      }
      if (!this.canPlace(corridor) || !exitForRoom || !this.createRoomByType(AreaType.room, exitForRoom))
        return false;
      corridor.exits.forEach((exit) => {
        if (exit == exitForRoom)
          return;
        corridor.floorTiles[exit.x + exit.y * this.width] = 2;
        this.unusedExits.push(exit);
      });
      if (!this.createRoomByType(AreaType.room, exitForRoom))
        this.addForcedType(corridor);
      this.doors.push(exitForRoom);
      this.placeRoom(corridor, Tile.TEST_FLOOR);
      return true;
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
            this.tiles[x + y * this.width] = Tile.TEST_WALL;
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

  // src/ts/engine/level/level_builder.ts
  var LevelBuilder = class {
    constructor(width, height, depth) {
      this.tiles = [];
      this.actors = [];
      this.width = width;
      this.height = height;
      this.tiles = new Array(width * height);
      this.depth = depth;
    }
    makeLevel() {
      let tileMap = new FeatureBuilder(this.width, this.height, this.tiles, this.depth);
      tileMap.generate();
      return new Level(this.width, this.height, this.tiles, this.actors);
    }
    addActors(amount) {
      for (let i = 0; i < amount; ++i) {
        let x;
        let y;
        do {
          x = Math.floor(Math.random() * this.width);
          y = Math.floor(Math.random() * this.height);
        } while (this.tiles[x + y * this.width].blocks);
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

  // src/ts/engine/render/terminal.ts
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
    getColoredCanvas(fontColor) {
      let cachedFont = this.cachedFonts.get(fontColor);
      if (cachedFont !== void 0) {
        return cachedFont;
      }
      let canvas = document.createElement("canvas");
      canvas.width = this.tileset.width;
      canvas.height = this.tileset.height;
      let ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(this.tileset, 0, 0);
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "rgb(" + fontColor.r + ", " + fontColor.g + ", " + fontColor.b + ")";
      ctx.fillRect(0, 0, this.tileset.width, this.tileset.height);
      this.cachedFonts.set(fontColor, canvas);
      return canvas;
    }
    tilesetLoaded() {
      document.dispatchEvent(this.imgLoaded);
    }
    clear() {
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.widthPixels, this.heightPixels);
    }
    putChar(glyph, x, y) {
      if (x < 0 || x > this.width)
        throw new Error(`x:${x} must be within range [0,${this.width}]`);
      if (y < 0 || y > this.height)
        throw new Error(`y:${y} must be within range [0,${this.height}]`);
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
    // Renders only modified glyphs since the last call. 
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
          let color = this.getColoredCanvas(glyph.fcol);
          this.ctx.drawImage(color, sx, sy, this.stepx, this.stepy, x * this.stepx, y * this.stepy, this.stepx, this.stepy);
          this.glyphs[x + y * this.width] = glyph;
          this.changedGlyphs[x + y * this.width] = null;
        }
      }
    }
  };

  // src/ts/engine/screen/viewport.ts
  var Viewport = class {
    constructor(x, y, width, height) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
    }
    static makeTerminal(width, height, tilesetUrl, stepx, stepy) {
      Viewport._terminal = new Terminal(width, height, tilesetUrl, stepx, stepy);
    }
    putChar(glyph, x, y) {
      let position = this.transform(x, y);
      if (position != null) {
        Viewport._terminal.putChar(glyph, position.x, position.y);
        return;
      }
    }
    render() {
      Viewport._terminal.render();
    }
    transform(x, y) {
      if (x < 0)
        return null;
      if (x >= this._width)
        return null;
      if (y < 0)
        return null;
      if (y >= this._height)
        return null;
      return new Position(this._x + x, this._y + y);
    }
  };

  // src/ts/engine/screen/camera.ts
  var Camera = class extends Viewport {
    constructor(x, y, width, height, boundWidth, boundHeigh) {
      super(x, y, width, height);
      this._camerax = 1;
      this._cameray = 1;
      this._camerax = 1;
      this._cameray = 1;
      this._boundWidth = boundWidth;
      this._boundHeight = boundHeigh;
    }
    moveCamera(targetx, targety) {
      let x = targetx - this._width / 2;
      let y = targety - this._height / 2;
      if (x == this._camerax && y == this._cameray) {
        return;
      }
      if (x < 0)
        x = 0;
      if (y < 0)
        y = 0;
      if (x > this._boundWidth - this._width)
        x = this._boundWidth - this._width;
      if (y > this._boundHeight - this._height)
        y = this._boundHeight - this._height;
      this._camerax = x;
      this._cameray = y;
    }
    toCameraCoordinates(x, y) {
      let newx = x - this._camerax;
      let newy = y - this._cameray;
      if (newx < 0 || newy < 0 || newx >= this._width || newy >= this._height)
        return { _x: x, _y: y, inBounds: false };
      x = newx;
      y = newy;
      return { _x: x, _y: y, inBounds: true };
    }
    isInsideViewport(x, y) {
      if (x < 1 || y < 1 || x >= this._width + 1 || y >= this._height + 1)
        return false;
      return true;
    }
    getGlobalCoordinates(x, y) {
      if (x < 1 || y < 1 || x >= this._width + 1 || y >= this._height + 1)
        return { x, y, inBounds: false };
      x += this._camerax;
      y += this._cameray;
      return { _x: x, _y: y, inBounds: true };
    }
    get camerax() {
      return this._camerax;
    }
    get cameray() {
      return this._cameray;
    }
    get width() {
      return this._width;
    }
    get height() {
      return this._height;
    }
  };

  // src/ts/engine/core/game.ts
  var lastRender;
  var Game = class {
    constructor() {
      this.loop = (timestamp) => {
        this.update();
        Game.inputKey = "NoInput" /* NO_INPUT */;
        lastRender = timestamp;
        window.requestAnimationFrame(this.loop);
      };
      Game.inputKey = "NoInput" /* NO_INPUT */;
      document.addEventListener("imgLoaded", this.initGame.bind(this));
      lastRender = 0;
    }
    // sync image src load 
    initGame(e) {
      document.removeEventListener("imgLoaded", this.initGame);
      document.addEventListener("keydown", this.kbInput, false);
      window.requestAnimationFrame(this.loop);
    }
    // user input
    kbInput(e) {
      e.preventDefault();
      Game.inputKey = e.key;
    }
  };

  // src/ts/game/hero/hero.ts
  var Hero = class extends Actor {
    constructor(x, y, glyph) {
      super(x, y, glyph);
      this.hp = 30;
    }
    isPlayer() {
      return true;
    }
  };

  // src/ts/game/level_manager.ts
  var LevelManager = class {
    constructor() {
      this._levels = /* @__PURE__ */ new Map();
    }
    makeLevel(label, width, height, depth) {
      let level = new LevelBuilder(width, height, depth).makeLevel();
      this._levels.set(label, level);
      return level;
    }
    makeActive(label) {
      this._activeLevel = this.validateLevel(label);
      return this._activeLevel;
    }
    getActiveLevel() {
      return this._activeLevel;
    }
    validateLevel(label) {
      try {
        let level = this._levels.get(label);
        if (level !== void 0)
          return level;
        throw new Error(`level with "${label}" label does not exists`);
      } catch (error) {
        throw error;
      }
    }
  };

  // src/ts/game/action/rest_action.ts
  var RestAction = class extends Action {
    perform(owner, game2) {
      return new ActionResult(true, false, null, null);
    }
  };

  // src/ts/game/action/walk_action.ts
  var WalkAction = class extends Action {
    constructor(position) {
      super();
      this.position = Position.from(position);
    }
    perform(owner, currentLevel) {
      let targetPosition = Position.add(this.position, owner.position);
      if (DebugSettings.noCollision) {
        owner.position = Position.from(targetPosition);
        return new ActionResult(true, true, null, null);
      }
      if (currentLevel.blocks(targetPosition)) {
        return new ActionResult(false, true, null, null);
      }
      const levelActors = currentLevel.actors;
      for (const actor of levelActors) {
        if (actor.blocks && owner.position.equals(targetPosition)) {
          if (!owner.isPlayer && !actor.isPlayer) {
            break;
          }
          return new ActionResult(true, true, null, null);
        }
      }
      owner.position = Position.from(targetPosition);
      return new ActionResult(true, true, null, null);
    }
  };

  // src/ts/game/screen/play_screen.ts
  var PlayScreen = class {
    constructor(x, y, width, height, boundWidth, boundHeigh) {
      this._cameraViewport = new Camera(x, y, width, height, boundWidth, boundHeigh);
    }
    render(currentLevel, position) {
      this._cameraViewport.moveCamera(position.x, position.y);
      this.drawMap(currentLevel);
      this.drawCorpses(currentLevel);
      this.drawActors(currentLevel);
      this._cameraViewport.render();
    }
    drawMap(currentLevel) {
      for (let i = 0; i < this._cameraViewport.width; ++i) {
        for (let j = 0; j < this._cameraViewport.height; ++j) {
          let x = this._cameraViewport.camerax + i;
          let y = this._cameraViewport.cameray + j;
          let position = new Position(x, y);
          if (DebugSettings.noFov) {
            this._cameraViewport.putChar(currentLevel.getChar(position), i, j);
            continue;
          }
          if (currentLevel.isInFov(position)) {
            this._cameraViewport.putChar(currentLevel.getChar(position), i, j);
          } else if (currentLevel.isExplored(position)) {
            this._cameraViewport.putChar(Tile.FOG.glyph, i, j);
          } else {
            this._cameraViewport.putChar(Tile.FOG.glyph, i, j);
          }
        }
      }
    }
    drawCorpses(currentLevel) {
    }
    drawActors(currentLevel) {
      const levelActors = currentLevel.actors;
      for (const actor of levelActors) {
        const point = this._cameraViewport.toCameraCoordinates(actor.position.x, actor.position.y);
        if (DebugSettings.noFov && point.inBounds) {
          this._cameraViewport.putChar(actor.glyph, point._x, point._y);
          continue;
        }
        if (currentLevel.isInFov(actor.position)) {
          if (point.inBounds) {
            this._cameraViewport.putChar(actor.glyph, point._x, point._y);
          } else {
            this._cameraViewport.putChar(Tile.FOG.glyph, point._x, point._y);
          }
        }
      }
    }
    getKeyAction(inputKey) {
      switch (inputKey) {
        case "w" /* W */:
        case "ArrowUp" /* ARROW_UP */:
          return new WalkAction(new Position(0, -1));
        case "s" /* S */:
        case "ArrowDown" /* ARROW_DOWN */:
          return new WalkAction(new Position(0, 1));
        case "a" /* A */:
        case "ArrowLeft" /* ARROW_LEFT */:
          return new WalkAction(new Position(-1, 0));
        case "d" /* D */:
        case "ArrowRight" /* ARROW_RIGHT */:
          return new WalkAction(new Position(1, 0));
        case "e" /* E */:
        case "PageUp" /* PAGE_UP */:
          return new WalkAction(new Position(1, -1));
        case "q" /* Q */:
        case "Home" /* HOME */:
          return new WalkAction(new Position(-1, -1));
        case "c" /* C */:
        case "PageDown" /* PAGE_DOWN */:
          return new WalkAction(new Position(1, 1));
        case "z" /* Z */:
        case "End" /* END */:
          return new WalkAction(new Position(-1, 1));
        case "Space" /* SPACE */:
          return new RestAction();
        case "NoInput" /* NO_INPUT */:
          return null;
        default:
          return null;
      }
    }
  };

  // src/ts/game/main.ts
  var DebugSettings = class {
  };
  DebugSettings.noFov = true;
  DebugSettings.noCollision = true;
  var MyGame = class extends Game {
    constructor() {
      super();
      Viewport.makeTerminal(100, 100, "data/cp437_16x16_test.png", 16, 16);
      this.levelManager = new LevelManager();
      this.currentLevel = this.levelManager.makeLevel("test", 100, 100, 1);
      this.player = new Hero(25, 25, new Glyph("@", Color.white, Color.black));
      this.currentLevel.addActor(this.player);
      this.currentLevel.computeFov(this.player.position, 8, 0 /* RecursiveShadowcasting */);
      this.currentScreen = new PlayScreen(6, 6, 50, 50, this.currentLevel.width, this.currentLevel.height);
    }
    update() {
      let action = this.currentScreen.getKeyAction(Game.inputKey);
      if (action) {
        let result = action.perform(this.player, this.currentLevel);
        while (result.altAction) {
          action = result.altAction;
          result = action.perform(this.player, this);
        }
        if (result.moved) {
          this.currentLevel.computeFov(this.player.position, 8, 0 /* RecursiveShadowcasting */);
        }
        if (result.performed) {
        }
      }
      this.currentScreen.render(this.currentLevel, this.player.position);
    }
  };
  var game = new MyGame();
})();
