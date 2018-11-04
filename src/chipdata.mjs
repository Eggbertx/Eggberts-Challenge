// load and parse DAT file
import { DataStream, Prim } from 'sphere-runtime';

let sprites = []; // array of images for each sprite

export let numLevels;
export let levels = [];
export let sounds = [];

function makeLevel(levelInfo,topTiles,bottomTiles,fields) {
	levels.push(Object.assign({
		numTopTiles: topTiles.length,
		topTiles: topTiles,
		numBottomTiles: bottomTiles.length,
		bottomTiles: bottomTiles,
		fields: fields,

		playerPos: {x: null, y: null, layer: null},
		fireBoots: false,
		waterBoots: false,
		iceBoots: false,
		pushBoots: false,
		redKey: 0,
		greenKey: 0,
		blueKey: 0,
		yellowKey: 0
	}, levelInfo));
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

export function loadData() {
	let reader = new DataStream("CHIPS.DAT", FileOp.Read);
	if(!reader.readUint8() == 0xAC
	|| !reader.readUint8() == 0xAA
	|| !reader.readUint8() == 0x02
	|| !reader.readUint8() == 0x00) {
		throw new Error("Invalid CHIPS.DAT signature");
	}

	numLevels = reader.readUint16(true);
	// SSj.log(`CHIPS.DAT has ${numLevels} levels`);

	for(var l = 0; l < numLevels; l++) {
		var levelInfo = reader.readStruct({
			numBytes: {type: 'uint16le'},
			levelNum: {type: 'uint16le'},
			timeLeft: {type: 'uint16le'},
			chipsLeft: {type: 'uint16le'},
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
	loadSounds();
}

export function loadSounds() {
	sounds["bell"] = new Sample("@/sounds/BELL.WAV");
	sounds["blip2"] = new Sample("@/sounds/BLIP2.WAV");
	sounds["bummer"] = new Sample("@/sounds/BUMMER.WAV");
	sounds["chimes"] = new Sample("@/sounds/CHIMES.WAV");
	sounds["ditty1"] = new Sample("@/sounds/DITTY1.WAV");
	return sounds;
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