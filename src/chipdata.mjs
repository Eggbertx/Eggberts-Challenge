// load and parse DAT file
import { DataStream, Prim } from 'sphere-runtime';

var sprites = []; // array of images for each sprite

export var numLevels;
export var levels = [];

export const Tile = {
	Floor: 0,
	Wall: 1,
	Chip: 2,
	Water: 3,
	Fire: 4,
	Floor2: 5,
	TopWall: 6,
	LeftWall: 7,
	BottomWall: 8,
	RightWall: 9,
	Dirt: 10,
	WetDirt: 11,
	Ice: 12,
	ForceDown: 13,
	Dirt2: 14,
	Dirt3: 15,
	Dirt4: 16,
	Dirt5: 17,
	ForceUp: 18,
	ForceRight: 19,
	ForceLeft: 20,
	Portal: 21,
	BlueLock: 22,
	RedLock: 23,
	GreenLock: 24,
	YellowLock: 25,
	IceWallUL: 26,
	IceWallUR: 27,
	IceWallBR: 28,
	IceWallBL: 29,
	FalseWall: 30,
	FalseWall2: 31,
	Floor3: 32,
	Spy: 33,
	PortalSocket: 34,
	DoorToggle: 35,
	FireballSpawner: 36,
	BlockedWall: 37,
	UnblockedWall: 38,
	GreyButton: 39, // ??
	TankButton: 40,
	Teleport: 41, // ??
	Bomb: 42,
	DirtButton: 43,
	Floor4: 44,
	Gravel: 45,
	WallButton: 46,
	Info: 47,
	FloorWallBR: 48, // ??
	SpecialWall: 49, // ??
	SpecialForce: 50, // ??
	Splash: 51,
	BurnedFire: 52,
	BurnedNoFire: 53,
	Floor5: 54,
	Floor6: 55,
	Floor7: 56,
	PortalWin: 57,
	Portal2: 58,
	Portal3: 59,
	SwimNorth: 60,
	SwimWest: 61,
	SwimSouth: 62,
	SwimEast: 63,
	BugNorth: 64,
	BugWest: 65,
	BugSouth: 66,
	BugEast: 67,
	Fireball: 68,
	Fireball2: 69,
	Fireball3: 70,
	Fireball4: 71,
	BallNorth: 72,
	BallWest: 73,
	BallSouth: 74,
	BallEast: 75,
	TankNorth: 76,
	TankWest: 77,
	TankSouth: 78,
	TankEast: 79,
	ShipNorth: 80,
	ShipWest: 81,
	ShipSouth: 82,
	ShipEast: 83,
	MonsterNorth: 84,
	MonsterWest: 85,
	MonsterSouth: 86,
	MonsterEast: 87,
	Ball2North: 88,
	Ball2West: 89,
	Ball2South: 90,
	Ball2East: 91,
	Slime: 92,
	Slime2: 93,
	Slime3: 94,
	Slime4: 95,
	CaterpillarNorth: 96,
	CaterpillarWest: 97,
	CaterpillarSouth: 98,
	CaterpillarEast: 99,
	BlueKey: 100,
	RedKey: 101,
	GreenKey: 102,
	YellowKey: 103,
	Flippers: 104,
	FireBoots: 105,
	IceSkates: 106,
	SuctionBoots: 107,
	ChipNorth: 108,
	ChipWest: 109,
	ChipSouth: 110,
	ChipEast: 111
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
	var floors = [];
	var sprites = [];
	var tiles = new Texture(filename);
	for(var x = 0; x < 10; x++) {
		for(var y = 0; y < 16; y++) {
			var tileImg = new Surface(32,32);
			
			Prim.blitSection(tileImg, 0,0, tiles, x*32, y*32, 32, 32);
			if(x < 7) floors.push(tileImg.toTexture());
			else sprites.push(tileImg.toTexture());
		}
	}
	return {
		floors: floors,
		sprites: sprites
	};
}