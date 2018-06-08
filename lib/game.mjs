// handle gameplay

const kb = Keyboard.Default;
const font = Font.Default;

const view = {x:32,y:32,x2:319,y2:319}
const UPPER_LEFT = {x: view.x,y:view.y};
const LOWER_RIGHT = {x: view.y2, y: view.y2};
const SCREEN_SIZE = 288
const ANIM_SPEED = 0; // if 0, no animation, if > 0, ANIM_SPEED = pixels per frame

const window_bg = LoadImage("background.png");
const numbers_img = LoadSurface("timefont.png");
const numbers_pos = {
	level: 	{x: 387, y: 63},
	time: {x: 387, y: 125},
	chipsLeft: {x: 387, y: 215}
};

var numbers_digits = [];
for(var i = 0; i < 10; i++) {
	numbers_digits[i] = numbers_img.cloneSection(14*(i+1),0,15,23);
}

var game_running = true;
var current_level = 1;
var time_left = 100;
var chips_left = 10;

var Level = {
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


function startGame() {
	Dispatch.onUpdate(function() {
		if(kb.getKey() == Key.Escape) Sphere.shutDown();
		if(game_running) {

		}
	});

	Dispatch.onRender(function() {
		window_bg.blit(0,0);
		drawNumber(current_level,numbers_pos.level.x, numbers_pos.level.y);
		drawNumber(time_left,numbers_pos.time.x, numbers_pos.time.y);
		drawNumber(chips_left,numbers_pos.chipsLeft.x, numbers_pos.chipsLeft.y);
	});
}

function drawNumber(number,x,y) {
	if(number > 999 || number < 0)
		Sphere.abort("ERROR: Invalid number: " + number);
	var digits = number.toString().split('').map(Number);
	if(digits.length == 3) {
		numbers_digits[digits[0]].blit(x,y);
		numbers_digits[digits[1]].blit(x+17,y);
		numbers_digits[digits[2]].blit(x+34,y);
	} else if(digits.length == 2) {
		numbers_digits[digits[0]].blit(x+17,y);
		numbers_digits[digits[1]].blit(x+34,y);
	} else if(digits.length == 1)
		numbers_digits[digits[0]].blit(x+34,y);
}

function drawBoard() {

}

function loadLevel(level) {

}

export { startGame, drawBoard, loadLevel, Level }