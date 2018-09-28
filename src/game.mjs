import { Console, Music, Prim, Thread } from 'sphere-runtime';
import { registerEvent } from 'buttonEvent';

import { levels, loadTiles, loadData, Tile } from './chipdata';

const kb = Keyboard.Default;
const font = Font.Default;
const screen = Surface.Screen;
const mouse = Mouse.Default;

const view = {x:17,y:17,x2:303,y2:303}
const UPPER_LEFT = {x: view.x,y:view.y};
const LOWER_RIGHT = {x: view.y2, y: view.y2};
const SCREEN_SIZE = 288
const ANIM_SPEED = 0; // if 0, no animation, if > 0, ANIM_SPEED = pixels per frame

const background = new Texture("@/images/background-new.png");
const pointerImg = new Texture("@/images/pointer.png");
const numbersImg = new Texture("@/images/timefont-new.png");
const numbersPos = {
	level: {x: 368, y: 46},
	time: {x: 368, y: 122},
	chipsLeft: {x: 368, y: 197}
};

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

	get currentLevel() {
		return levels[this.levelNum];
	}

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
		this.levelNum = 0;
		this.timeLeft = 100;
		this.chipsLeft = 10;

		this.fireBoots = false;
		this.waterBoots = false;
		this.iceBoots = false;
		this.pushBoots = false;

		this.redKey = 0;
		this.greenKey = 0;
		this.blueKey = 0;
		this.yellowKey = 0;
		this.items = [];

		registerEvent(Keyboard.Default, Key.Up, () => {
			if(this.isObstructed(this.playerPos.x, this.playerPos.y-1, this.playerPos.layer)) return;
			this.cameraY++;
			this.moveTo(this.playerPos, {x: this.playerPos.x, y: this.playerPos.y-1, layer: this.playerPos.layer});
		});
		registerEvent(Keyboard.Default, Key.Down, () => {
			if(this.isObstructed(this.playerPos.x, this.playerPos.y+1, this.playerPos.layer)) return;
			this.cameraY--;
			this.moveTo(this.playerPos, {x: this.playerPos.x, y: this.playerPos.y+1, layer: this.playerPos.layer});
		});
		registerEvent(Keyboard.Default, Key.Left, () => {
			if(this.isObstructed(this.playerPos.x-1, this.playerPos.y, this.playerPos.layer)) return;
			this.cameraX++;
			this.moveTo(this.playerPos, {x: this.playerPos.x-1, y: this.playerPos.y, layer: this.playerPos.layer});
		});
		registerEvent(Keyboard.Default, Key.Right, () => {
			if(this.isObstructed(this.playerPos.x+1, this.playerPos.y, this.playerPos.layer)) return;
			this.cameraX--;
			this.moveTo(this.playerPos, {x: this.playerPos.x+1, y: this.playerPos.y, layer: this.playerPos.layer});
		});

		Music.push("CANYON.OGG");
		Music.push("CHIP01.OGG");
		Music.push("CHIP02.OGG");

		loadData();
		var tiles = loadTiles("@/images/tileset.png");
		this.floorTiles = tiles.floors;
		this.spriteTiles = tiles.sprites;
	}

	drawMap(offsetX, offsetY) {
		for(var t = 0; t < this.currentLevel.numBottomTiles; t++) {
			var x = (t % 32) + offsetX;
			var y = Math.floor(t/32) + offsetY;
	
			var bottomTile = this.floorTiles[this.currentLevel.bottomTiles[t]];
			Prim.blit(screen, x*32 - 16, y * 32 + 16, bottomTile);
	
			var topTile = this.floorTiles[this.currentLevel.topTiles[t]];
			Prim.blit(screen, x*32 - 16,y*32 + 16,topTile);
		}
		Sphere.abort(this.numChips);
	}
	
	isObstructed(x, y, layer) {
		var tileAt = this.getTile(x, y, layer);
		var index = posToIndex(x, y)
		switch(tileAt) {
			case Tile.Wall:
				return true;
			case Tile.RedLock:
				if(this.redKey > 0) {
					this.redKey--;
					if(layer == 0)
						this.currentLevel.bottomTiles[index] = Tile.Floor;
					else 
						this.currentLevel.topTiles[index] = Tile.Floor;
				} else {
					return true;
				}
				break;

			case Tile.GreenLock:
				if(this.greenKey > 0) {
					// this.greenKey--;
					if(layer == 0)
						this.currentLevel.bottomTiles[index] = Tile.Floor;
					else 
						this.currentLevel.topTiles[index] = Tile.Floor;
				} else {
					return true;
				}
				break;

			case Tile.YellowLock:
				if(this.yellowKey > 0) {
					this.yellowKey--;
					if(layer == 0)
						this.currentLevel.bottomTiles[index] = Tile.Floor;
					else 
						this.currentLevel.topTiles[index] = Tile.Floor;
				} else {
					return true;
				}
				break;
		}
		return false;
	}

	moveTo(fromPos, toPos) {
		var fromTile = this.getTile(fromPos.x, fromPos.y, fromPos.layer);
		var fromIndex = posToIndex(fromPos.x, fromPos.y);
		var toIndex = posToIndex(toPos.x, toPos.y);
		if(toPos.layer == 0) {
			this.currentLevel.bottomTiles[fromIndex] = Tile.Floor;
			this.currentLevel.bottomTiles[toIndex] = fromTile;
		} else {
			this.currentLevel.topTiles[fromIndex] = Tile.Floor;
			this.currentLevel.topTiles[toIndex] = fromTile;
		}
	}

	getPlayerPos() {
		for(var bt = 0; bt < this.currentLevel.numBottomTiles; bt++) {
			var bottomTile = this.currentLevel.bottomTiles[bt];
			if(bottomTile >= Tile.ChipNorth && bottomTile <= Tile.ChipEast) {
				var btPos = indexToPos(bt);
				return {x: btPos.x, y: btPos.y, layer: 0};
			}
		}
	
		for(var tt = 0; tt < this.currentLevel.numTopTiles; tt++) {
			var topTile = this.currentLevel.topTiles[tt];
			if(topTile >= Tile.ChipNorth && topTile <= Tile.ChipEast) {
				var ttPos = indexToPos(tt);
				return {x: ttPos.x, y: ttPos.y, layer: 1};
			}
		}
		return {
			x: undefined, y: undefined, layer: undefined
		}
	}

	getTile(x, y, layer) {
		var layerBytes;
		var tile = Tile.Floor;
		if(layer == 1) layerBytes = this.currentLevel.topTiles
		else layerBytes = this.currentLevel.bottomTiles;
		tile = layerBytes[posToIndex(x, y)];
		if(tile == undefined) tile = Tile.Floor;
		return tile;
	}

	on_update() {
		if(kb.getKey() == Key.Escape) Sphere.shutDown();
		this.playerPos = this.getPlayerPos();
	}

	on_render() {
		this.drawMap(-10+this.cameraX,-10+this.cameraY);
		Prim.blit(screen, 0, 0, background);
		drawNumber(this.levelNum+1,numbersPos.level.x, numbersPos.level.y);
		drawNumber(this.timeLeft,numbersPos.time.x, numbersPos.time.y);
		drawNumber(this.chipsLeft,numbersPos.chipsLeft.x, numbersPos.chipsLeft.y);
		Prim.blit(screen, mouse.x, mouse.y, pointerImg);
		font.drawText(screen, 0, 0, "Camera: (" + this.cameraX + "," + this.cameraY + ")");
		font.drawText(screen, 0, 12, "Player: (x:" + this.playerPos.x + ",y:" + this.playerPos.y + ", layer:" + this.playerPos.layer + ")");
	}
}

function drawNumber(number,x,y) {
	if(number > 999 || number < 0)
		throw new RangeError("Invalid number: " + number);

	var digits = number.toString().split('').map(Number);
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