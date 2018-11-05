import { sounds } from './chipdata';

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

function moveToLock(type, level, tilePos, index) {

}

// if isObstructed is undefined, false is assumed
// if onMoveTo is undefined, the player moves and nothing else
export let reactions = [
	{ // Floor
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Wall
		isObstructed(level, tilePos, index) {
			return true;
		}
	},
	{ // Chip
		isObstructed(level, tilePos, index) {
			return false;
		},
		onMoveTo(level, tilePos, index) {
			if(level.chipsLeft > 0) level.chipsLeft--;
		},
	},
	{ // Water
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Fire
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Floor2
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // TopWall
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // LeftWall
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // BottomWall
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // RightWall
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Dirt
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // WetDirt
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Ice
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // ForceDown
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Dirt2
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Dirt3
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Dirt4
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Dirt5
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // ForceUp
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // ForceRight
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // ForceLeft
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // PortalWin
		isObstructed(level, tilePos, index) {
			return false;
		},
		onMoveTo(level, tilePos, index) {
			sounds["ditty1"].play(Mixer.Default);
		}
	},
	{ // BlueLock
		isObstructed(level, tilePos, index) {
			return level.inventory.indexOf(Tile.BlueKey) == -1;
		},
		onMoveTo(level, tilePos, index) {
			let i = level.inventory.indexOf(Tile.BlueKey);
			if(i > -1)
				level.inventory.splice(i, 1);
			else
				return true;
		}
	},
	{ // RedLock
		isObstructed(level, tilePos, index) {
			return level.inventory.indexOf(Tile.RedKey) == -1;
		},
		onMoveTo(level, tilePos, index) {
			let i = level.inventory.indexOf(Tile.RedKey);
			if(i > -1)
				level.inventory.splice(i, 1);
			else
				return true;
		}
	},
	{ // GreenLock
		isObstructed(level, tilePos, index) {
			return level.inventory.indexOf(Tile.GreenKey) == -1;
		},
		onMoveTo(level, tilePos, index) {
			
		}
	},
	{ // YellowLock
		isObstructed(level, tilePos, index) {
			return level.inventory.indexOf(Tile.YellowKey) == -1;
		},
		onMoveTo(level, tilePos, index) {
			let i = level.inventory.indexOf(Tile.YellowKey);
			if(i > -1)
				level.inventory.splice(i, 1);
			else
				return true;
		}
	},
	{ // IceWallUL
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // IceWallUR
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // IceWallBR
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // IceWallBL
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // FalseWall
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // FalseWall2
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Floor3
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Spy
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},

	{ // PortalSocket
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // DoorToggle
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // FireballSpawner
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // BlockedWall
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // UnblockedWall
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // GreyButton
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // TankButton
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Teleport
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Bomb
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // DirtButton
		isObstructed(level, tilePos, index) {
	
		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Floor4
		isObstructed(level, tilePos, index) {
	
		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // Gravel
		isObstructed(level, tilePos, index) {
	
		},
		onMoveTo(level, tilePos, index) {
	
		}
	},
	{ // WallButton
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Info
		isObstructed(level, tilePos, index) {
			return false;
		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // FloorWallBR
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // SpecialWall
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // SpecialForce
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Splash
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BurnedFire
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BurnedNoFire
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Floor5
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Floor6
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Floor7
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // PortalWin
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Portal2
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Portal3
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // SwimNorth
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // SwimWest
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // SwimSouth
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // SwimEast
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BugNorth
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BugWest
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BugSouth
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BugEast
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Fireball: 68,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Fireball2: 69,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Fireball3: 70,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Fireball4: 71,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BallNorth: 72,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BallWest: 73,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BallSouth: 74,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BallEast: 75,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // TankNorth: 76,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // TankWest: 77,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // TankSouth: 78,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // TankEast: 79,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // ShipNorth: 80,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // ShipWest: 81,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // ShipSouth: 82,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // ShipEast: 83,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // MonsterNorth: 84,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // MonsterWest: 85,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // MonsterSouth: 86,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // MonsterEast: 87,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Ball2North: 88,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Ball2West: 89,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Ball2South: 90,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Ball2East: 91,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Slime: 92,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Slime2: 93,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Slime3: 94,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // Slime4: 95,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // CaterpillarNorth: 96,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // CaterpillarWest: 97,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // CaterpillarSouth: 98,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // CaterpillarEast: 99,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // BlueKey: 100,
		isObstructed(level, tilePos, index) {
			return false;
		},
		onMoveTo(level, tilePos, index) {
			// level.blueKey++;
			level.inventory.push(Tile.BlueKey);
		}
	},
	{ // RedKey: 101,
		isObstructed(level, tilePos, index) {
			return false;
		},
		onMoveTo(level, tilePos, index) {
			// level.redKey++;
			level.inventory.push(Tile.RedKey);
		}
	},
	{ // GreenKey: 102,
		isObstructed(level, tilePos, index) {
			return false;
		},
		onMoveTo(level, tilePos, index) {
			// level.greenKey++;
			level.inventory.push(Tile.GreenKey);
		}
	},
	{ // YellowKey: 103,
		isObstructed(level, tilePos, index) {
			return false;
		},
		onMoveTo(level, tilePos, index) {
			// level.yellowKey++;
			level.inventory.push(Tile.YellowKey);
		}
	},
	{ // Flippers: 104,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // FireBoots: 105,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // IceSkates: 106,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // SuctionBoots: 107,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // ChipNorth: 108,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // ChipWest: 109,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // ChipSouth: 110,
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	},
	{ // ChipEast: 111
		isObstructed(level, tilePos, index) {

		},
		onMoveTo(level, tilePos, index) {

		}
	}
];


/*
{
	isObstructed(level, tilePos, index) {

	},
	onMoveTo(level, tilePos, index) {

	}
}
*/