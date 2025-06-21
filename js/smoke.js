const SMOKE_COUNT = [2, 4];
const SMOKE_SPEED = [5, 10];
const SMOKE_SIZE = [5, 10];
const SMOKE_FRICTION = 0.85;
const SMOKE_FADESPEED = 0.035;
const SMOKE_SPREAD = 0.5;

export class Smoke {
	constructor(options) {
		// Store the parentContainer reference
		this.parentContainer = options.parentContainer;

		// The clouds
		this.clouds = [];

		// Updating
		options.startUpdating(this.update.bind(this));

		// Binding public functions
		this.create = this.create.bind(this);
	}

	// Create a cloud puff
	create(x, y, dir, intensity) {
		// Creating the individual clouds
		var createCloud = function (x, y, dir, intensity) {
			// The cloud element
			var el = $('<div class="cloud"></div>');

			// Positioning and sizing
			var size = getRandom(SMOKE_SIZE[0], SMOKE_SIZE[1]) * intensity;
			el.css({
				left: x,
				top: y,
				width: size,
				height: size,
			});

			// Spread
			dir += getRandom(-SMOKE_SPREAD * 100, SMOKE_SPREAD * 100) / 100;

			// Movement
			var speed = getRandom(SMOKE_SPEED[0], SMOKE_SPEED[1]) * intensity;
			var xvel = Math.cos(dir + Math.PI / 2) * speed;
			var yvel = Math.sin(dir + Math.PI / 2) * speed;

			// Return the cloud object
			return {
				el: el,
				x: x,
				y: y,
				dir: dir,
				xvel: xvel,
				yvel: yvel,
				opacity: 1,
			};
		};

		// Generating the clouds
		var count = getRandom(SMOKE_COUNT[0], SMOKE_COUNT[1]);
		for (var i = 0; i < count; i++) {
			var newCloud = createCloud(x, y, dir, intensity);

			// Store the cloud object
			this.clouds.push(newCloud);

			// Inject the cloud element
			this.parentContainer.append(newCloud.el);
		}
	}

	// Updating the clouds
	update() {
		for (var i = 0; i < this.clouds.length; i++) {
			var cloud = this.clouds[i];

			// Movement
			cloud.x += cloud.xvel;
			cloud.y += cloud.yvel;
			cloud.xvel *= SMOKE_FRICTION;
			cloud.yvel *= SMOKE_FRICTION;

			// Opacity
			cloud.opacity -= SMOKE_FADESPEED;

			// Updating styles
			cloud.el.css({
				left: cloud.x,
				top: cloud.y,
				opacity: cloud.opacity,
			});

			// Removing it
			if (cloud.opacity <= 0) {
				cloud.el.remove();
				this.clouds.splice(i, 1);
			}
		}
	}
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}