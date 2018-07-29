// handle gameplay
import { Prim, Console } from 'sphere-runtime';

const kb = Keyboard.Default;
const font = Font.Default;
const screen = Surface.Screen;

const view = {x:32,y:32,x2:319,y2:319}
const UPPER_LEFT = {x: view.x,y:view.y};
const LOWER_RIGHT = {x: view.y2, y: view.y2};
const SCREEN_SIZE = 288
const ANIM_SPEED = 0; // if 0, no animation, if > 0, ANIM_SPEED = pixels per frame

const window_bg = new Texture("@/images/background.png");
const numbers_img = new Texture("@/images/timefont.png");
const numbers_pos = {
	level: {x: 387, y: 63},
	time: {x: 387, y: 125},
	chipsLeft: {x: 387, y: 215}
};

let digits_X = []; // each digt is 15x23
for(let x = 14; x < numbers_img.width; x+=14) {
	digits_X.push(x);
}

var game_running = true;
var current_level = 1;
var time_left = 100;
var chips_left = 10;

export var Level = {
	running: true,
	level: 1,
	timeLeft: 100,
	chipsLeft: 10,
	
	fireBoots: false,
	waterBoots: false,
	iceBoots: false,
	pushBoots: false,
	
	redKey: false,
	greenKey: false,
	blueKey: false,
	yellowKey: false
}


export function startGame() {
	Dispatch.onUpdate(function() {
		if(kb.getKey() == Key.Escape) Sphere.shutDown();
		if(game_running) {

		}
	});

	Dispatch.onRender(function() {
		Prim.blit(screen, 0, 0, window_bg);
		drawNumber(current_level,numbers_pos.level.x, numbers_pos.level.y);
		drawNumber(time_left,numbers_pos.time.x, numbers_pos.time.y);
		drawNumber(chips_left,numbers_pos.chipsLeft.x, numbers_pos.chipsLeft.y);
	});
}

function drawNumber(number,x,y) {
	if(number > 999 || number < 0)
		throw new Error("ERROR: Invalid number: " + number);

	var digits = number.toString().split('').map(Number);
	if(digits.length == 3) {
		Prim.blitSection(screen, x, y, numbers_img, digits_X[digits[0]], 0, 15, 23);
		Prim.blitSection(screen, x+17, y, numbers_img, digits_X[digits[1]], 0, 15, 23);
		Prim.blitSection(screen, x+34, y, numbers_img, digits_X[digits[2]], 0, 15, 23);
	} else if(digits.length == 2) {
		Prim.blitSection(screen, x+17, y, numbers_img, digits_X[digits[0]], 0, 15, 23);
		Prim.blitSection(screen, x+34, y, numbers_img, digits_X[digits[1]], 0, 15, 23);
	} else if(digits.length == 1) {
		Prim.blitSection(screen, x+34, y, numbers_img, digits_X[digits[0]], 0, 15, 23);
	}
}

export function drawMap() {

}

export function loadLevel(level) {

}