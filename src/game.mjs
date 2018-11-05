import { Console, Music, Prim, Thread } from 'sphere-runtime';
import { registerEvent } from 'buttonEvent';

import { levels, loadSounds, loadTiles, loadData } from './chipdata';
import { Tile, reactions } from './tiles';

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

const inventoryPos = {x:326,y:232};
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
		this.levelNum = 0;

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

		Music.push("CHIP02.OGG");
		Music.push("CHIP01.OGG");
		Music.push("CANYON.OGG");

		loadData();
		this.currentLevel = levels[this.levelNum];
		let tiles = loadTiles("@/images/tileset.png");
		this.floorTiles = tiles.floors;
		this.spriteTiles = tiles.sprites;
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

	drawMap(offsetX, offsetY) {
		for(let t = 0; t < this.currentLevel.numBottomTiles; t++) {
			let x = (t % 32) + offsetX;
			let y = Math.floor(t/32) + offsetY;
	
			let bottomTile = this.floorTiles[this.currentLevel.bottomTiles[t]];
			Prim.blit(screen, x*32 - 16, y * 32 + 16, bottomTile);
	
			let topTile = this.floorTiles[this.currentLevel.topTiles[t]];
			Prim.blit(screen, x*32 - 16,y*32 + 16,topTile);
		}
	}
	
	isObstructed(x, y, layer) {
		let tileAt = this.getTile(x, y, layer);
		let index = posToIndex(x, y)
		return reactions[tileAt].isObstructed(this.currentLevel, {x,y,layer},index);
	}

	moveTo(fromPos, toPos) {
		let fromTile = this.getTile(fromPos.x, fromPos.y, fromPos.layer);
		let fromIndex = posToIndex(fromPos.x, fromPos.y);
		let toIndex = posToIndex(toPos.x, toPos.y);
		let tileAt = this.getTile(toPos.x, toPos.y, toPos.layer);
		if(toPos.layer == 0) {
			this.currentLevel.bottomTiles[fromIndex] = Tile.Floor;
			this.currentLevel.bottomTiles[toIndex] = fromTile;
		} else {
			this.currentLevel.topTiles[fromIndex] = Tile.Floor;
			this.currentLevel.topTiles[toIndex] = fromTile;
		}
		reactions[tileAt].onMoveTo(this.currentLevel, toPos, toIndex);
		if(this.currentLevel.chipsLeft == 0) {
			for(let t = 0; t < this.currentLevel.numTopTiles; t++) {
				if(this.currentLevel.topTiles[t] == Tile.PortalSocket)
				this.currentLevel.topTiles[t] = Tile.Floor;
			}
			for(let b = 0; b < this.currentLevel.numBottomTiles; b++) {
				if(this.currentLevel.bottomTiles[b] == Tile.PortalSocket)
				this.currentLevel.bottomTiles[b] = Tile.Floor;
			}
		}
	}

	getPlayerPos() {
		for(let bt = 0; bt < this.currentLevel.numBottomTiles; bt++) {
			let bottomTile = this.currentLevel.bottomTiles[bt];
			if(bottomTile >= Tile.ChipNorth && bottomTile <= Tile.ChipEast) {
				let btPos = indexToPos(bt);
				return {x: btPos.x, y: btPos.y, layer: 0};
			}
		}
	
		for(let tt = 0; tt < this.currentLevel.numTopTiles; tt++) {
			let topTile = this.currentLevel.topTiles[tt];
			if(topTile >= Tile.ChipNorth && topTile <= Tile.ChipEast) {
				let ttPos = indexToPos(tt);
				return {x: ttPos.x, y: ttPos.y, layer: 1};
			}
		}
		return {
			x: undefined, y: undefined, layer: undefined
		}
	}

	getTile(x, y, layer) {
		let layerBytes;
		let tile = Tile.Floor;
		if(layer == 1) layerBytes = this.currentLevel.topTiles
		else layerBytes = this.currentLevel.bottomTiles;
		tile = layerBytes[posToIndex(x, y)];
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
		if(kb.getKey() == Key.Escape) Sphere.shutDown();
		this.playerPos = this.getPlayerPos();
	}

	on_render() {
		this.drawMap(-10+this.cameraX,-10+this.cameraY);
		Prim.blit(screen, 0, 0, background);
		drawNumber(this.levelNum+1,numbersPos.level.x, numbersPos.level.y);
		drawNumber(this.currentLevel.timeLeft,numbersPos.time.x, numbersPos.time.y);
		drawNumber(this.currentLevel.chipsLeft,numbersPos.chipsLeft.x, numbersPos.chipsLeft.y);
		Prim.blit(screen, mouse.x, mouse.y, pointerImg);
		// font.drawText(screen, 0, 0, "Camera: (" + this.cameraX + "," + this.cameraY + ")");
		// font.drawText(screen, 0, 12, "Player: (x:" + this.playerPos.x + ",y:" + this.playerPos.y + ", layer:" + this.playerPos.layer + ")");
		this.drawInventory();
	}
}

function drawNumber(number,x,y) {
	if(number > 999 || number < 0)
		throw new RangeError("Invalid number: " + number);
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