import { Console, Music, Prim, Thread } from 'sphere-runtime';
import { registerEvent } from 'buttonEvent';

import { ChipsDat, Tile } from './chipdata';


const font = Font.Default;
const screen = Surface.Screen;
const kb = Keyboard.Default;
// const mouse = Mouse.Default;
const console = new Console();

const view = {x:17,y:17,x2:303,y2:303}
const SCREEN_SIZE = 288
const ANIM_SPEED = 0; // if 0, no animation, if > 0, ANIM_SPEED = pixels per frame

const background = new Texture("@/images/background-new.png");
// const pointerImg = new Texture("@/images/pointer.png");
const numbersImg = new Texture("@/images/timefont-new.png");
const LEVEL_POS = {x: 368, y: 46};
const TIME_POS = {x: 368, y: 122};
const CHIPSLEFT_POS = {x: 368, y: 197};

const inventoryPos = {x:326, y:232};
let digitsX = []; // each digt is 16x27


function posToIndex(x, y) {
	return x + (y * 32);
}

function indexToPos(index) {
	return {
		x: (index % 32),
		y: Math.floor(index / 32)
	};
}


export default class Game extends Thread {
	constructor() {
		super();

		this.cameraX = 0;
		this.cameraY = 0;

		for(let x = 0; x < numbersImg.width; x+=15) {
			digitsX.push(x);
		}

		this.playerPos = {x: undefined, y: undefined, layer: undefined};
		this.lastMoved = 0;
		this.gameRunning = true;
		this.now = Date.now();
		this.levelNum = 0;

		this.items = [];
		this.lastPressedButtons = []; // example: {device: Keyboard.Default, key: Key.Up, time: num}

		registerEvent(Keyboard.Default, Key.Up, () => {
			this.move(this.playerPos, 0, -1, 0);
		});
		registerEvent(Keyboard.Default, Key.Down, () => {
			this.move(this.playerPos, 0, 1, 0);
		});
		registerEvent(Keyboard.Default, Key.Left, () => {
			this.move(this.playerPos, -1, 0, 0);
		});
		registerEvent(Keyboard.Default, Key.Right, () => {
			this.move(this.playerPos, 1, 0, 0);
		});

		Music.push("@/music/CHIP02.OGG");
		Music.push("@/music/CHIP01.OGG");
		Music.push("@/music/CANYON.OGG");

		this.chipsDat = new ChipsDat(console);
		this.chipsDat.loadGraphics("@/images/tileset.png");
		this.chipsDat.loadSounds();
		this.chipsDat.loadLevels("@/CHIPS.DAT");
		this.playerPos = this.getPlayerPos();
	}

	get currentLevel() {
		return this.levels[this.levelNum];
	}

	reaction(tile1, tile2) {
		// for example, tile1 = Tile.Chip, tile2 = Tile.Wall
	}
	
	onTick(tile, tilepos, level) {
	
	}

	get sounds() {
		return this.chipsDat.sounds;
	}

	get levels() {
		return this.chipsDat.levels;
	}

	get floorTiles() {
		return this.chipsDat.floorTiles;
	}

	get spriteTiles() {
		return this.chipsDat.spriteTiles;
	}

	drawInventory() {
		let y = inventoryPos.y;
		let unique = this.getUniqueKeys();
		for(let i = 0; i < unique.length; i++) {
			if(i == 5) y += 32;
			let x = inventoryPos.x+i*32;
			let numKeys = this.countKeys(unique[i]);
			Prim.blit(screen, x,y, this.spriteTiles[unique[i]-64]);
			if(unique[i] > 99 && unique[i] < 104) {
				let width = font.getTextSize(numKeys).width;
				font.drawText(screen, x, y, numKeys, Color.Black);
			}
		}
	}

	drawMap() {
		for(let t = 0; t < this.currentLevel.numBottomTiles; t++) {
			let x = (t % 32) - this.playerPos.x + 5;
			let y = Math.floor(t/32) - this.playerPos.y + 4;

			let bottomTile = this.floorTiles[this.currentLevel.bottomTiles[t]];
			// Prim.blit(screen, x*32 - 16, y * 32 + 16, bottomTile);
	
			let topTile = this.floorTiles[this.currentLevel.topTiles[t]];
			Prim.blit(screen, x*32 - 16,y*32 + 16,topTile);
		}
	}

	drawNumber(number,x,y) {
		if(number > 999) number = 999;
		if(number < 0) number = 0;
		let digits = number.toString().split('').map(Number);
	
		if(digits.length == 3) {
			Prim.blitSection(screen, x, y, numbersImg, digitsX[digits[0]], 0, 16, 27);
			Prim.blitSection(screen, x+17, y, numbersImg, digitsX[digits[1]], 0, 16, 27);
			Prim.blitSection(screen, x+34, y, numbersImg, digitsX[digits[2]], 0, 16, 27);
		} else if(digits.length == 2) {
			Prim.blitSection(screen, x+17, y, numbersImg, digitsX[digits[0]], 0, 16, 27);
			Prim.blitSection(screen, x+34, y, numbersImg, digitsX[digits[1]], 0, 16, 27);
		} else if(digits.length == 1) {
			Prim.blitSection(screen, x+34, y, numbersImg, digitsX[digits[0]], 0, 16, 27);
		}
	}

	// check if the given tile is a Chip sprite.
	// If `includeWater` is true, swimming sprites are included
	tileIsPlayer(tile, includeWater) {
		if(includeWater)
			return (tile >= Tile.ChipSwimN) && (tile <= Tile.ChipSwimE)
				&& (tile >= Tile.ChipN) && (tile <= Tile.ChipE);
		else return (tile >= Tile.ChipSwimN) && (tile <= Tile.ChipSwimE);
	}
	
	// check if `tile` would be obstructed by the tile at {x,y,layer}
	isObstructed(x, y, layer, tile) {
		let tileAt = this.getTile(x, y, layer);
		let index = posToIndex(x, y);
		let isPlayer = this.tileIsPlayer(tile, true);
		switch(tileAt) {
			case Tile.Floor:
				return false;
			case Tile.Wall:
			case Tile.InvisibleWall:
			case Tile.CloningBlockN:
			case Tile.CloningBlockW:
			case Tile.CloningBlockS:
			case Tile.CloningBlockE:
			case Tile.BlueRealWall:
			case Tile.Socket:
			case Tile.SwitchClosed:
			case Tile.Cloner:
				return true;
			case Tile.BlueLock:

				break;
			case Tile.ComputerChip:
				if(isPlayer) {
					return false;
				}
				return true;
			case Tile.Water:
				if(this.tileIsPlayer(tile) || tile == Tile.DirtBlock) return false;
				return true;
			
		}
		return false;
	}

	move(fromPos, numX, numY, layerDiff) {
		return;
		let toLayer = fromPos.layer;
		if(layerDiff != undefined) toLayer += layerDiff
		let toX = fromPos.x + numX;
		let toY = fromPos.y + numY;

		let fromTile = this.getTile(fromPos.x, fromPos.y, fromPos.layer);
		let fromIndex = posToIndex(fromPos.x, fromPos.y);

		let toTile = this.getTile(toX, toY, toLayer);
		let toIndex = posToIndex(toX, toY);

		let tileAt = this.getTile(toX, toY, toLayer);

		let obstructed = this.isObstructed(toX, toY, toLayer, fromTile);
		if(obstructed) return;
		if(toLayer == 0) {
			this.currentLevel.bottomTiles[fromIndex] = Tile.Floor;
			this.currentLevel.bottomTiles[toIndex] = fromTile;
		} else {
			this.currentLevel.topTiles[fromIndex] = Tile.Floor;
			this.currentLevel.topTiles[toIndex] = fromTile;
		}

		if(this.currentLevel.chipsLeft == 0) {
			for(let t = 0; t < this.currentLevel.numTopTiles; t++) {
				if(this.currentLevel.topTiles[t] == Tile.Socket)
				this.currentLevel.topTiles[t] = Tile.Floor;
			}
			for(let b = 0; b < this.currentLevel.numBottomTiles; b++) {
				if(this.currentLevel.bottomTiles[b] == Tile.Socket)
				this.currentLevel.bottomTiles[b] = Tile.Floor;
			}
		}
		SSj.log(`Player position: ${this.playerPos.x},${this.playerPos.y},${this.playerPos.layer}`);
		SSj.log(`Camera position: ${this.cameraX},${this.cameraY}`);
		// if(this.isObstructed(this.playerPos.x, this.playerPos.y-1, this.playerPos.layer)) return;
		this.cameraX -= numX;
		this.cameraY -= numY;
	}

	getPlayerPos() {
		let pos = { x: undefined, y: undefined, layer: undefined };
		for(let bt = 0; bt < this.currentLevel.numBottomTiles; bt++) {
			let bottomTile = this.currentLevel.bottomTiles[bt];
			if(bottomTile >= Tile.ChipN && bottomTile <= Tile.ChipE) {
				let btPos = indexToPos(bt);
				pos = { x: btPos.x, y: btPos.y, layer: 0 };
				break;
			}
		}
	
		for(let tt = 0; tt < this.currentLevel.numTopTiles; tt++) {
			let topTile = this.currentLevel.topTiles[tt];
			if(topTile >= Tile.ChipN && topTile <= Tile.ChipE) {
				let ttPos = indexToPos(tt);
				pos = { x: ttPos.x, y: ttPos.y, layer: 1 };
				break;
			}
		}
		return pos;
	}

	getTile(x, y, layer) {
		let layerBytes;
		if(layer == 1) layerBytes = this.currentLevel.topTiles
		else layerBytes = this.currentLevel.bottomTiles;
		let tile = layerBytes[posToIndex(x, y)];
		if(tile == undefined) tile = Tile.Floor;
		return tile;
	}

	countKeys(keyType) {
		let num = 0;
		for(let i = 0; i < this.currentLevel.inventory.length; i++) {
			if(this.currentLevel.inventory[i] == keyType) num++;
		}
		return num;
	}

	getUniqueKeys() {
		let unique = [];
		for(let i = 0; i < this.currentLevel.inventory.length; i++) {
			if(unique.indexOf(this.currentLevel.inventory[i]) == -1)
				unique.push(this.currentLevel.inventory[i]);
		}
		return unique;
	}

	setTile(x, y, layer, tile) {
		let fromTile = this.getTile(x,y,layer);
		if(layer == 1) this.currentLevel.topTiles[posToIndex(x,y)] = tile;
		else layerBytes = this.currentLevel.bottomTiles[posToIndex(x,y)] = tile;
		return fromTile;
	}

	on_update() {
		if(kb.isPressed(Key.Escape)) Sphere.shutDown();
		// this.playerPos = this.getPlayerPos();
		let newNow = Date.now();
		if(newNow >= this.now + 1000) {
			this.now = newNow;
			this.currentLevel.timeLeft--;
		}
		if(this.currentLevel.timeLeft == 0 && this.gameRunning) {
			this.gameRunning = false;
			this.sounds["bell"].play(Mixer.Default);
		}
	}

	on_render() {
		this.drawMap();
		Prim.blit(screen, 0, 0, background);
		this.drawNumber(this.levelNum+1,LEVEL_POS.x, LEVEL_POS.y);
		this.drawNumber(this.currentLevel.timeLeft, TIME_POS.x, TIME_POS.y);
		this.drawNumber(this.currentLevel.chipsLeft,CHIPSLEFT_POS.x, CHIPSLEFT_POS.y);
		// Prim.blit(screen, mouse.x, mouse.y, pointerImg);
		// font.drawText(screen, 0, 0, "Camera: (" + this.cameraX + "," + this.cameraY + ")");
		// font.drawText(screen, 0, 12, "Player: (x:" + this.playerPos.x + ",y:" + this.playerPos.y + ", layer:" + this.playerPos.layer + ")");
		this.drawInventory();
	}
}
