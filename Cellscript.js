Object.assign(Sphere.Game, {
	name: "Eggbertx's Challenge",
	author: "Eggbertx",
	summary: "A port of Chip's Challenge to the Sphere game engine ",
	version: 2,
	apiLevel: 2,
	saveID: "Eggbertx.EggbertxsChallenge",
	resolution: "480x320",
	main: "bin/game.js",
	fullScreen: false,
});

install('@/bin', files('src/*.js', true));
install('@/lib', files('lib/*.js', true));
install('@/images', files('images/*.png', false));
install('@/sounds', files('sounds/*', true));
install('@/music', files('music/*', true));
install('@/', files('CHIPS.DAT'));
install('@/', files('images/icon.png'));
