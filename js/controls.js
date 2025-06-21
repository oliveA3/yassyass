export class Controls {
	constructor(options) {
		this.keys = [
			{
				name: "right",
				keyCode: 68,
			},
			{
				name: "left",
				keyCode: 65,
			},
			{
				name: "up",
				keyCode: 87,
			},
			{
				name: "down",
				keyCode: 83,
			},
		];

		// Listening for keypresses
		this.createListeners();

		// Binding public functions
		this.isDown = this.isDown.bind(this);
	}

	// Get a key object based on it's keycode
	getKey(keyCode) {
		for (var i = 0; i < this.keys.length; i++) {
			if (this.keys[i].keyCode === keyCode) {
				return this.keys[i];
			}
		}
	}

	// Check if a key is down
	isDown(key) {
		for (var i = 0; i < this.keys.length; i++) {
			if (this.keys[i].name == key) {
				return this.keys[i].isDown;
			}
		}
	}

	// Create the keydown event listener
	createListeners() {
		// Key presses
		$(window).on(
			"keydown",
			function (e) {
				var pressedKey = this.getKey(e.which);

				if (pressedKey != null) {
					pressedKey.isDown = true;
				}
			}.bind(this)
		);

		// Key released
		$(window).on(
			"keyup",
			function (e) {
				var pressedKey = this.getKey(e.which);

				if (pressedKey != null) {
					pressedKey.isDown = false;
				}
			}.bind(this)
		);
	}
}
