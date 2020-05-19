// load and parse DAT file
import { DataStream, Prim } from 'sphere-runtime';

const _nullTile = new Surface(32,32);
const _nullConsole = { log() {} };

export class ChipsDat {
	constructor(console = _nullConsole) {
		this.numLevels = 0;
		this.levels = [];
		this.sounds = [];
		this.floorTiles = [];
		this.spriteTiles = [];
		this.console = console;
	}

	static get nullTile() {
		return _nullTile;
	}

	logLevelInfo(num) {
		if(num > this.numLevels)
			throw new RangeError(`Level #${num} doesn't exist`);
		// Sphere.abort(Object.keys(this.levels[num]));
		this.console.log(`Level ${levelInfo.levelNum} at reader position ${reader.position}:`);
		this.console.log("\t# of bytes:: " + levelInfo.numBytes);
		this.console.log("\tTime limit: " + levelInfo.timeLimit);
		this.console.log("\tRequired chips: " + levelInfo.reqChips);
		this.console.log("\tLevel detail: " + levelInfo.levelDetail);
		this.console.log(`\t1st layer has ${ layer1NumBytes } bytes`);
		this.console.log(`\t2nd layer has ${ layer2NumBytes } bytes`);
	}

	loadLevels(filename) {
		let reader = new DataStream(filename, FileOp.Read);
	
		let signature = reader.readUint32(true);
		if(signature != 0x0002AAAC && signature != 0x0102AAAC)
			throw new Error("Invalid CHIPS.DAT signature");
	
		this.numLevels = reader.readUint16(true);
		this.console.log(`${filename} has ${this.numLevels} levels`);
	
		for(let l = 0; l < this.numLevels; l++) {
			let levelInfo = reader.readStruct({
				numBytes: {type: 'uint16le'},
				levelNum: {type: 'uint16le'},
				timeLeft: {type: 'uint16le'},
				chipsLeft: {type: 'uint16le'},
				levelDetail: {type: 'uint16le'}
			});

			
			let layer1NumBytes = reader.readUint16(true);
			let layer1Bytes = decodeRLE(reader, layer1NumBytes);
			this.console.log(`\tExpanded to ${layer1Bytes.length}`);
	
			let layer2NumBytes = reader.readUint16(true);
			let layer2Bytes = decodeRLE(reader, layer2NumBytes);
	
			let numOptionalFieldBytes = reader.readUint16(true);
			this.console.log("\tNumber of bytes in optional fields: " + numOptionalFieldBytes);
			let readOptionalBytes = 0;
			let fields = {};
			while(readOptionalBytes < numOptionalFieldBytes) {
				let fieldType = reader.readUint8();
				readOptionalBytes++;
				this.console.log("\tField type: " + fieldType);
				let numFieldBytes = reader.readUint8();
				readOptionalBytes += numFieldBytes + 1;
				// this.console.log("\t# of field bytes: " + numFieldBytes);
				switch(fieldType) {
					case 1:
						throw new Error("Invalid map field (level time field isn't used)");
						break;
					case 2:
						throw new Error("Invalid map field (number of chips field isn't used");
						break;
					case 3:
						fields.title = reader.readStringRaw(numFieldBytes);
						this.console.log("\t\tMap title: " + fields.title);
						break;
					case 4:
						fields.trapControls = [];
						for(let t = 0; t < numFieldBytes; t += 10) {
							let button = {x: reader.readUint16(true), y: reader.readUint16(true)};
							let trap = {x: reader.readUint16(true), y: reader.readUint16(true)};
							this.console.log(`\t\tButton at (${button.x},${button.y}) controls trap at (${trap.x},${trap.y})`);
							if(reader.readUint16(true) != 0)
								throw new Error("Invalid trap field");
							fields.trapControls.push({button: button, trap: trap});
						}
						break;
					case 5:
						fields.cloneControls = [];
						for(let c = 0; c < numFieldBytes; c += 8) {
							let button = {x: reader.readUint16(true), y: reader.readUint16(true)};
							let clone = {x: reader.readUint16(true), y: reader.readUint16(true)};
							this.console.log(`\t\tButton at (${button.x},${button.y}) controls clone at (${clone.x},${clone.y})`);
							fields.cloneControls.push({button: button, clone: clone});
						}
						break;
					case 6:
						fields.password = "";
						for(let p = 0; p < numFieldBytes; p++) {
							let byte = reader.readUint8();
							if(byte > 0) fields.password += String.fromCharCode(byte ^ 0x99);
						}
						this.console.log("\t\tPassword: " + fields.password);
						break;
					case 7:
						fields.hint = reader.readStringRaw(numFieldBytes);
						this.console.log("\t\tMap hint: " + fields.hint);
						break;
					case 8:
						throw new Error("Invalid map field (unencrypted password isn't used)");
						break;
					case 9:
						throw new Error("Field not used");
						break;
					case 10:
						fields.monsters = [];
						for(let m = 0; m < numFieldBytes; m += 2) {
							let x = reader.readUint8();
							let y = reader.readUint8();
							//this.console.log(`\t\tMonster at (${x},${y})`);
							fields.monsters.push({x: x, y: y});
						}
						break;
					default:
						throw new Error("Invalid field type: " + fieldType);
						break;
				}
			}
			
			this.levels.push(
				Object.assign({
					numTopTiles: layer1Bytes.length,
					topTiles: layer1Bytes,
					numBottomTiles: layer2Bytes.length,
					bottomTiles: layer2Bytes,
					fields: fields,

					fireBoots: false,
					waterBoots: false,
					iceBoots: false,
					pushBoots: false,
					inventory: []
				}, levelInfo)
			);
		}
	}

	loadGraphics(filename) {
		let tilesImg = new Texture(filename);
		for(let i = 0; i < Tile.ChipE; i++) {
			let y = i % 16;
			let x = (i - y) / 16;
			let tileImg = new Surface(32,32);
			Prim.blitSection(tileImg, 0,0, tilesImg, x*32, y*32, 32, 32);
			if(i < Tile.BugN) {
				this.floorTiles[i] = tileImg;
				this.spriteTiles = ChipsDat.nullTile;
			} else {
				this.floorTiles[i] = ChipsDat.nullTile;
				this.spriteTiles[i] = tileImg;
			}
		}
	}

	loadSounds() {
		this.sounds["bell"] = new Sample("@/sounds/BELL.WAV");
		this.sounds["blip2"] = new Sample("@/sounds/BLIP2.WAV");
		this.sounds["bummer"] = new Sample("@/sounds/BUMMER.WAV");
		this.sounds["chimes"] = new Sample("@/sounds/CHIMES.WAV");
		this.sounds["ditty1"] = new Sample("@/sounds/DITTY1.WAV");
	}
}

// based on RAMPKORV's Java implementation
function decodeRLE(reader, numBytes) {
	// 0xFF,<num_bytes>,<byte_to_copy>
	let decoded = [];
	while(numBytes-- > 0) {
		let byte = reader.readUint8();
		if(byte >= 0x00 && byte <= 0x6F) {
			decoded.push(byte);
		} else if(byte == 0xFF) {
			let numRepeats = reader.readUint8();
			let data = reader.readUint8();
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

export const Tile = {
	Floor:			0x00,
	Wall:			0x01,
	ComputerChip:	0x02,
	Water:			0x03,
	Fire:			0x04,
	InvisibleWall:	0x05,
	BlockedN:		0x06,
	BlockedW:		0x07,
	BlockedS:		0x08,
	BlockedE:		0x09,
	DirtBlock:		0x0A,
	Dirt:			0x0B,
	Ice:			0x0C,
	ForceS:			0x0D,
	CloningBlockN:	0x0E,
	CloningBlockW:	0x0F,

	CloningBlockS:	0x10,
	CloningBlockE:	0x11,
	ForceN:			0x12,
	ForceE:			0x13,
	ForceW:			0x14,
	Exit:			0x15,
	BlueLock:		0x16,
	RedLock:		0x17,
	GreenLock:		0x18,
	YellowLock:		0x19,
	SEIceSlide:		0x1A,
	SWIceSlide:		0x1B,
	NWIceSlide:		0x1C,
	NEIceSlide:		0x1D,
	BlueFakeWall:	0x1E,
	BlueRealWall:	0x1F,

	Unused1:		0x20,
	Thief:			0x21,
	Socket:			0x22,
	DoorButton:		0x23,
	CloningButton:	0x24,
	SwitchOpen:		0x25,
	SwitchClosed:	0x26,
	TrapsButton:	0x27,
	TanksButton:	0x28,
	Teleporter:		0x29,
	Bomb:			0x2A,
	Trap:			0x2B,
	InvisibleWall:	0x2C,
	Gravel:			0x2D,
	PassOnce:		0x2E,
	Hint:			0x2F,

	BlockedSE:		0x30,
	Cloner:			0x31,
	ForceRandom:	0x32,
	DrowningChip:	0x33,
	BurnedChip:		0x34,
	BurnedChip2:	0x35,
	Unused2:		0x36,
	Unused3:		0x37,
	Unused4:		0x38,
	ChipExit:		0x39,
	EndExit1:		0x3A,
	EndExit2:		0x3B,
	ChipSwimN:		0x3C,
	ChipSwimW:		0x3D,
	ChipSwimS:		0x3E,
	ChipSwimE:		0x3F,

	BugN:		0x40,
	BugW:		0x41,
	BugS:		0x42,
	BugE:		0x43,
	FireballN:	0x44,
	FireballW:	0x45,
	FireballS:	0x46,
	FireballE:	0x47,
	PinkBallN:	0x48,
	PinkBallW:	0x49,
	PinkBallS:	0x4A,
	PinkBallE:	0x4B,
	TankN:		0x4C,
	TankW:		0x4D,
	TankS:		0x4E,
	TankE:		0x4F,

	GliderN:	0x50,
	GliderW:	0x51,
	GliderS:	0x52,
	GliderE:	0x53,
	TeethN:		0x54,
	TeethW:		0x55,
	TeethS:		0x56,
	TeethE:		0x57,
	WalkerN:	0x58,
	WalkerW:	0x59,
	WalkerS:	0x5A,
	WalkerE:	0x5B,
	BlobN:		0x5C,
	BlobW:		0x5D,
	BlobS:		0x5E,
	BlobE:		0x5F,

	ParameciumN:	0x60,
	ParameciumW:	0x61,
	ParameciumS:	0x62,
	ParameciumE:	0x63,
	BlueKey:		0x64,
	RedKey:			0x65,
	GreenKey:		0x66,
	YellowKey:		0x67,
	Flippers:		0x68,
	FireBoots:		0x69,
	IceSkates:		0x6A,
	SuctionBoots:	0x6B,
	ChipN:			0x6C,
	ChipW:			0x6D,
	ChipS:			0x6E,
	ChipE:			0x6F
}