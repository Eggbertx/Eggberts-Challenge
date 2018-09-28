// load and parse DAT file
import { DataStream, Prim } from 'sphere-runtime';

var sprites = []; // array of images for each sprite

export var numLevels;
export var levels = [];

export const Tile = {
	FLOOR: 0,
	WALL: 1,
	CHIP: 2,
	WATER: 3,
	FIRE: 4,
	FLOOR2: 5,
	TOPWALL: 6,
	LEFTWALL: 7,
	BOTTOMWALL: 8,
	RIGHTWALL: 9,
	DIRT: 10,
	WETDIRT: 11,
	ICE: 12,
	FORCEDOWN: 13,
	DIRT2: 14,
	DIRT3: 15,
	DIRT4: 16,
	DIRT5: 17,
	FORCEUP: 18,
	FORCERIGHT: 19,
	FORCEEFT: 20,
	PORTAL: 21,
	BLUELOCK: 22,
	REDLOCK: 23,
	GREENLOCK: 24,
	YELLOWLOCK: 25,
	ICEWALLTL: 26,
	ICEWALLTR: 27,
	ICEWALLBR: 28,
	ICEWALLBL: 29,
	FALSEWALL: 30,
	FALSEWALL2: 31,
	FLOOR3: 32,
	SPY: 33,
	PORTAL_SOCKET: 34,
	DOORTOGGLE: 35,
	FIREBALL_SPAWNER: 36,
	BLOCKED_WALL: 37,
	UNBLOCKED_WALL: 38,
	GREY_BUTTON: 39, // ??
	TANK_BUTTON: 40,
	TELEPORT: 41, // ??
	BOMB: 42,
	DIRT_BUTTON: 43,
	FLOOR4: 44,
	GRAVEL: 45,
	WALL_BUTTON: 46,
	INFO: 47,
	FLOORWALLBR: 48, // ??
	SPECIAL_WALL: 49, // ??
	SPECIAL_FORCE: 50, // ??
	SPLASH: 51,
	BURN_FIRE: 52,
	BURN_NOFIRE: 53,
	FLOOR5: 54,
	FLOOR6: 55,
	FLOOR7: 56,
	PORTAL_WIN: 57,
	PORTAL2: 58,
	PORTAL3: 59,
	SWIM_UP: 60,
	SWIM_LEFT: 61,
	SWIM_DOWN: 62,
	SWIM_RIGHT: 63,
	BUG_UP: 64,
	BUG_LEFT: 65,
	BUG_DOWN: 66,
	BUG_RIGHT: 67,
	FIREBALL: 68,
	FIREBALL2: 69,
	FIREBALL3: 70,
	FIREBALL4: 71,
	BALL_UP: 72,
	BALL_LEFT: 73,
	BALL_DOWN: 74,
	BALL_RIGHT: 75,
	TANK_UP: 76,
	TANK_LEFT: 77,
	TANK_DOWN: 78,
	TANK_RIGHT: 79,
	SHIP_UP: 80,
	SHIP_LEFT: 81,
	SHIP_DOWN: 82,
	SHIP_RIGHT: 83,
	MONSTER_UP: 84,
	MOSTER_LEFT: 85,
	MONSTER_DOWN: 86,
	MONSTER_RIGHT: 87,
	BALL2_UP: 88,
	BALL2_LEFT: 89,
	BALL2_DOWN: 90,
	BALL2_RIGHT: 91,
	SLIME: 92,
	SLIME2: 93,
	SLIME3: 94,
	SLIME4: 95,
	CATERPILLAR_UP: 96,
	CATERPILLAR_LEFT: 97,
	CATERPILLAR_DOWN: 98,
	CATERPILLAR_RIGHT: 99,
	BLUE_KEY: 100,
	RED_KEY: 101,
	GREEN_KEY: 102,
	YELLOW_KEY: 103,
	FLIPPERS: 104,
	FIRE_BOOTS: 105,
	ICE_SKATES: 106,
	SUCTION_BOOTS: 107,
	CHIP_UP: 108,
	CHIP_LEFT: 109,
	CHIP_DOWN: 110,
	CHIP_RIGHT: 111
};

function makeLevel(levelInfo,topTiles,bottomTiles,fields) {
	levels.push({
		ID: levelInfo.levelNum,
		numBytes: levelInfo.numBytes,
		timeLimit: levelInfo.timeLimit,
		reqChips: levelInfo.reqChips,
		levelDetail: levelInfo.levelDetail,
		numTopTiles: topTiles.length,
		topTiles: topTiles,
		numBottomTiles: bottomTiles.length,
		bottomTiles: bottomTiles,
		fields: fields
	});
}


// based on RAMPKORV's Java implementation
function decodeRLE(reader, numBytes) {
	// 0xFF,<num_bytes>,<byte_to_copy>
	var decoded = [];
	while(numBytes-- > 0) {
		var byte = reader.readUint8();
		if(byte >= 0x00 && byte <= 0x6F) {
			decoded.push(byte);
		} else if(byte == 0xFF) {
			var numRepeats = reader.readUint8();
			var data = reader.readUint8();
			numBytes -= 2;
			while(numRepeats-- > 0) {
				decoded.push(data);
			}
		} else {
			throw new Error("Unrecognized object: " + byte.toString(16));
		}
	}
	return decoded;
}

export function loadAllLevels() {

}

export function loadLevel() {

}

export function loadData() {
	let reader = new DataStream("CHIPS.DAT", FileOp.Read);
	if(!reader.readUint8() == 0xAC ||
		!reader.readUint8() == 0xAA ||
		!reader.readUint8() == 0x02 ||
		!reader.readUint8() == 0x00) {
			throw new Error("Invalid CHIPS.DAT signature");
	}

	numLevels = reader.readUint16(true);
	SSj.log(`CHIPS.DAT has ${numLevels} levels`);

	for(var l = 0; l < numLevels; l++) {
		var levelInfo = reader.readStruct({
			numBytes: {type: 'uint16le'},
			levelNum: {type: 'uint16le'},
			timeLimit: {type: 'uint16le'},
			reqChips: {type: 'uint16le'},
			levelDetail: {type: 'uint16le'}
		});
		/*SSj.log(`Level ${levelInfo.levelNum} at reader position ${reader.position}:`);
		SSj.log("\t# of bytes:: " + levelInfo.numBytes);
		SSj.log("\tTime limit: " + levelInfo.timeLimit);
		SSj.log("\tRequired chips: " + levelInfo.reqChips);
		SSj.log("\tLevel detail: " + levelInfo.levelDetail);*/
		
		var layer1NumBytes = reader.readUint16(true);
		// SSj.log(`\t1st layer has ${ layer1NumBytes } bytes`);
		var layer1Bytes = decodeRLE(reader, layer1NumBytes);
		// SSj.log(`\tExpanded to ${layer1Bytes.length}`);

		var layer2NumBytes = reader.readUint16(true);
		//SSj.log(`\t2nd layer has ${ layer2NumBytes } bytes`);
		var layer2Bytes = decodeRLE(reader, layer2NumBytes);
		//SSj.log(`\tExpanded to ${layer2Bytes.length}`);

		var numOptionalFieldBytes = reader.readUint16(true);
		// SSj.log("\tNumber of bytes in optional fields: " + numOptionalFieldBytes);
		var readOptionalBytes = 0;
		var fields = {};
		while(readOptionalBytes < numOptionalFieldBytes) {
			var fieldType = reader.readUint8();
			readOptionalBytes++;
			// SSj.log("\tField type: " + fieldType);
			var numFieldBytes = reader.readUint8();
			readOptionalBytes += numFieldBytes + 1;
			// SSj.log("\t# of field bytes: " + numFieldBytes);
			switch(fieldType) {
				case 1:
					throw new Error("Invalid map field (level time field isn't used)");
					break;
				case 2:
					throw new Error("Invalid map field (number of chips field isn't used");
					break;
				case 3:
					fields.title = reader.readStringRaw(numFieldBytes);
					//SSj.log("\t\tMap title: " + fields.title);
					break;
				case 4:
					fields.trapControls = [];
					for(var t = 0; t < numFieldBytes; t += 10) {
						var button = {x: reader.readUint16(true), y: reader.readUint16(true)};
						var trap = {x: reader.readUint16(true), y: reader.readUint16(true)};
						//SSj.log(`\t\tButton at (${button.x},${button.y}) controls trap at (${trap.x},${trap.y})`);
						if(reader.readUint16(true) != 0)
							throw new Error("Invalid trap field");
						fields.trapControls.push({button: button, trap: trap});
					}
					break;
				case 5:
					fields.cloneControls = [];
					for(var c = 0; c < numFieldBytes; c += 8) {
						var button = {x: reader.readUint16(true), y: reader.readUint16(true)};
						var clone = {x: reader.readUint16(true), y: reader.readUint16(true)};
						//SSj.log(`\t\tButton at (${button.x},${button.y}) controls clone at (${clone.x},${clone.y})`);
						fields.cloneControls.push({button: button, clone: clone});
					}
					break;
				case 6:
					fields.password = "";
					for(var p = 0; p < numFieldBytes; p++) {
						var byte = reader.readUint8();
						if(byte > 0) fields.password += String.fromCharCode(byte ^ 0x99);
					}
					//SSj.log("\t\tPassword: " + fields.password);
					break;
				case 7:
					fields.hint = reader.readStringRaw(numFieldBytes);
					//SSj.log("\t\tMap hint: " + fields.hint);
					break;
				case 8:
					throw new Error("Invalid map field (unencrypted password isn't used)");
					break;
				case 9:
					throw new Error("Field not used");
					break;
				case 10:
					fields.monsters = [];
					for(var m = 0; m < numFieldBytes; m += 2) {
						var x = reader.readUint8();
						var y = reader.readUint8();
						//SSj.log(`\t\tMonster at (${x},${y})`);
						fields.monsters.push({x: x, y: y});
					}
					break;
				default:
					throw new Error("Invalid field type: " + fieldType);
					break;
			}
		}
		//SSj.log("");
		makeLevel(levelInfo,layer1Bytes, layer2Bytes, fields);
	}
}

export function loadTiles(filename) {
	var tiles = [];
	var currentTile = 0;
	var allTiles = new Texture(filename);
	for(var x = 0; x < 10; x++) {
		for(var y = 0; y < 16; y++) {
			var tile = new Surface(32,32);
			Prim.blitSection(tile, 0,0, allTiles, x*32, y*32, 32, 32);
			tiles.push(tile.toTexture());
			currentTile++;
		}
	}
	return tiles;
}