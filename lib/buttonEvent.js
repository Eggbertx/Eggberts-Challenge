/*
 * A simple but handy button press/release event handler
 */

import { Thread } from "sphere-runtime";

var events = [];

export class ButtonEvent extends Thread {
	constructor(device, button, onPress, onRelease) {
		super();
		this.device = device;
		this.button = button;
		this.onPress = onPress;
		this.onRelease = onRelease;
		if(this.onRelease === undefined) this.onRelease = function() {} // optional
		var isDown = false; // private
		this.on_update = function() {
			if(device.isPressed(button) && !isDown) {
				// button was up, is now pressed
				isDown = true;
				this.onPress();
			} else if(!device.isPressed(button) && isDown) {
				// button was pressed, is now released
				isDown = false;
				this.onRelease();
			}
		}
		this.start();
	}
}


/* 
 * Example:
 * registerEvent(Mouse.Default, MouseKey.Left,
 * 	function() {
 * 		// onPress
 * 		const x = Mouse.Default.x;
 * 		const y = Mouse.Default.y;
 * 		for(button of guiButtons) {
 * 			if(button.contains(x,y)) button.pushAnim();
 * 		}
 * 	},
 * 	function() {
 * 		// onRelease
 * 		const x = Mouse.Default.x;
 * 		const y = Mouse.Default.y;
 * 		for(button of guiButtons) {
 * 			if(button.contains(x,y)) {
 * 				button.releaseAnim();
 * 				button.activate();
 * 			}
 * 		}
 * 	}
 * );
 */
export function registerEvent(device, button, onPress, onRelease) {
	if(getEvent(device, button) !== undefined)
		throw Error("Event already registered, call deleteEvent first");
	events.push(new ButtonEvent(device, button, onPress, onRelease));
}

/*
 * Example:
 * var button_event_obj = getEvent(Mouse.Default, MouseKey.Left);
 */
export function getEvent(device, button) {
	for(const event of events) {
		if(event.device == device && event.button == button) return event;
	}
}

/*
 * Example:
 * deleteEvent(Mouse.Default, MouseKey.Left);
 */
export function deleteEvent(device, button) {
	for(const e in events) {
		if(events[e] !== undefined && events[e].device == device && events[e].button == button) {
			events[e].stop();
			events.splice(e, 1);
		}
	}
}