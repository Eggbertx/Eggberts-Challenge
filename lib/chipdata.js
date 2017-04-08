// load and parse DAT file

const struct = require("struct");

const DAT_FILE = "CHIPS.DAT";
const MAP_SIZE = 32; // each map is 32x32 tiles
const TILE_SIZE = 32;

var dat_bin;
var levels = [];
var passwords = []; // array of four character strings representing the passwords to reload a save
var sprites = [];  // array of images for each sprite

var chips_dat_file;
var chips_dat_header;
var chips_dat_levels = [];
var data;
var tiles = [];

var tiles_enum = {
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


var num_levels = 0;

var LevelData = {
	ID: 0,
	numBytes: 0,
	timeLimit: 0,
	numChips: 0,
	mapDetail: 1,
	
	numTopTiles: 0,
	topTiles: [],
	numBottomTiles: 0,
	bottomTiles: []
}

function makeLevel(numBytes,timeLimit,numChips,topTiles,bottomTiles) {
	return {
		ID: ++num_levels,
		numBytes: numBytes,
		timeLimit: timeLimit,
		numChips: numChips,
		mapDetail: 1,
		numTopTiles: topTiles.length,
		topTiles: topTiles,
		numBottomTiles: bottomTiles.length,
		bottomTiles: bottomTiles
	};
}

function decodeRLE(data) {
	// 0xff,<num_bytes>,<byte_to_copy>
	var result = [];
	var breakChar = "\xff";
	var validObject = /[\x00-\x6F]/; // each object character must match this
	var arr = "";

	for(i = 0; i < data.length; i++) {
		arr += data[i] + ",";
	}
	
	for(var p = 0; p < data.length; p++) {
		// p = data pointer position
		if(data[p] == 0xFF) {
			// use RLE
			var num_copies = data[++p];
			var copied_byte = data[++p];
			for(c = 0; c < num_copies; c++) {
				result.push(copied_byte);
			}
			p++
		}
	
		var numBytes = data[++p];
		for(b = 0; b < numBytes; b++) {
			result.push(data[p++]);
		}
		
		if(!(0 <= data[p] <= 0x6F))
			system.abort("oh snap!")
	}
	return result;
}


function readLayer() {
	system.abort(first_layer_info);
	var width = 32;
	var height = 32;
	var bytesRead = 0;
	var objectsPlaced = 0;
	while(bytesRead < layerData.length) {
		//var read = chipDat.readUnsignedByte();
		bytesRead++;
		if (read >= 0x00 && read <= 0x6F) {
			//ret.addBlock(objectsPlaced % width, objectsPlaced / width, getBlock(read), layer);
			objectsPlaced++;
		} else if (read == 0xFF) {
			//int numRepeats = chipDat.readUnsignedByte();
			//int data = chipDat.readUnsignedByte();
			bytesRead += 2;
			while (numRepeats-- > 0) {
				//ret.addBlock(objectsPlaced % width, objectsPlaced / width, getBlock(data), layer);
				objectsPlaced++;
			}
		} else {
			system.abort("Object I couldn't parse: " + read);
		}
	}
}


function decryptPassword(pass) {
	var s = "";
	for(var i=0; i<pass.length; i++) {
		s += String.fromCharCode(pass[i] ^ 0x99);
	}
	return s;
}


exports.loadSprites = function() {
	var tiles_file = LoadSurface("tileset.png");
	for(i = 0,img_x = 0,img_y = 0; i < Object.keys(tiles_enum).length; i++ ) {
		if(img_y == tiles_file.height/TILE_SIZE) {
			img_x ++;
			img_y = 0;
		}
		tiles[i] = tiles_file.cloneSection(img_x*TILE_SIZE,img_y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
		img_y++;
	}
}

exports.loadData = function() {
	chips_dat_reader = new struct.Reader(FS.openFile("CHIPS.DAT","r"));

	chips_dat_header = chips_dat_reader.readStruct({
		magicNumber: {type: 'fstring', length: 4, regex: /\x00\x02\xAA\xAC/},
		numLevels: {type: 'uint16le'}
	});
	chips_dat_header.numLevels++;
	
	for(var l = 0; l < chips_dat_header.numLevels; l++) {
		var level_info = chips_dat_reader.readStruct({
			numBytes: {type: 'uint16le'},
			levelNum: {type: 'uint16le'},
			timeLimit: {type: 'uint16le'},
			reqChips: {type: 'uint16le'},
			levelDetail: {type: 'uint16le'}
		});

		var first_layer_info = chips_dat_reader.readStruct({
			numBytes: {type: 'uint16le'}
		});
		/*var first_layer_bytes = chips_dat_reader.readStruct({
			data: {type: 'raw', size: first_layer_info.numBytes}
		});

		var second_layer_info = chips_dat_reader.readStruct({
			numBytes: {type: 'uint16le'}
		});
		var second_layer_bytes = chips_dat_reader.readStruct({
			data: {type: 'raw', size: second_layer_info.numBytes}
		});
		first_layer_decoded = decodeRLE(first_layer_bytes.data);
		*/
		
		var x = 0;
		var y = 0;
		
		for(var i = 0; i < first_layer_decoded.length; i++) {
			system.abort(first_layer_decoded.length)
			if(tiles[first_layer_decoded[i]] != undefined) tiles[first_layer_decoded[i]].blit(x*32,y*32);
			tiles[tiles_enum.WETDIRT].blit(0,0);
			FlipScreen();
			Delay(3)
			x += 32;
		}
		FlipScreen();
		Delay(3000);
		second_layer_decoded = decodeRLE(second_layer_bytes.data);

		system.abort("got this far...");
	}
}

