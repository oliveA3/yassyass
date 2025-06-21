export class Bullet {
	constructor(options) {
		// Create the element
		this.createElement(options.parentContainer);
		this.createFlash(options.parentContainer, options.x, options.y);

		// Positioning / movement
		this.x = options.x;
		this.y = options.y;
		this.speed = 25;
		this.dir = options.dir;

		// Flash
		this.flashTimer = 0;
	}

	// Creating / injecting the Player element
	createElement(parentContainer) {
		// The markup
		this.el = $('<div class="bullet"></div>');

		// Injection
		parentContainer.append(this.el);

		// Dimensions
		this.width = parseInt(this.el.css("width"));
		this.height = parseInt(this.el.css("height"));
	}

	// Create the flash effect element
	createFlash(parentContainer, x, y) {
		// The markup
		this.flashEl = $('<div class="flash"></div>');

		// Positioning
		this.flashEl.css({
			left: x,
			top: y,
		});

		// Injection
		parentContainer.append(this.flashEl);
	}

	// Updating (executed automatically by the `BulletHandler` class.)
	update() {
		// Movement
		this.x += Math.cos(this.dir + Math.PI / 2) * this.speed;
		this.y += Math.sin(this.dir + Math.PI / 2) * this.speed;

		// Going out of bounds
		if (
			this.x < 0 ||
			this.y < 0 ||
			this.x > window.innerWidth ||
			this.y > window.innerHeight
		) {
			this.delete = true;
		}

		// Update styles
		this.el.css({
			left: this.x,
			top: this.y,
			transform: `
translateX(-50%)
translateY(-50%)
rotate(${this.dir + Math.PI / 2}rad)
`,
		});

		// Removing the flash
		this.flashTimer++;
		if (this.flashTimer > 1) {
			this.flashEl.remove();
		}
	}
}

// The Bullet Handler class
export class BulletHandler {
	constructor(options) {
		// Store options references
		this.parentContainer = options.parentContainer;
		this.enemyHandler = options.enemyHandler;

		// Store all bullets
		this.bullets = [];

		// Updating all bullets
		options.startUpdating(this.updateBullets.bind(this));

		// Binding public functions
		this.createBullet = this.createBullet.bind(this);
	}

	// Updating all of the bullets
	updateBullets() {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update();

			// Verificar colisión con enemigos
			for (var j = 0; j < this.enemyHandler.enemies.length; j++) {
				let enemy = this.enemyHandler.enemies[j];
				let dx = this.bullets[i].x - enemy.x;
				let dy = this.bullets[i].y - enemy.y;
				let dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < 20) {
					// Radio de colisión
					enemy.health--;
					if (enemy.health <= 0) {
						this.enemyHandler.enemies.splice(j, 1);
						enemy.el.remove();
						j--;
					}
					this.bullets[i].delete = true;
					break;
				}
			}

			if (this.bullets[i].delete) {
				this.bullets[i].el.remove();
				this.bullets[i].flashEl.remove();
				this.bullets.splice(i, 1);
				i--;
			}
		}
	}

	// Create a new bullet
	createBullet(x, y, dir) {
		this.bullets.push(
			new Bullet({
				x: x,
				y: y,
				dir: dir,
				parentContainer: this.parentContainer,
			})
		);
	}
}
