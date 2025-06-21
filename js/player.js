const SHOOT_KNOCKBACK = 5;
const SHOOT_KNOCKBACKRESET = 0.25;

export const mouse = {
	x: 0,
	y: 0,
};

export class Player {
	constructor(options) {
		// Store references
		this.controls = options.controls;
		this.createBullet = options.createBullet;
		this.createSmoke = options.createSmoke;

		this.maxHealth = 10;
		this.currentHealth = this.maxHealth;

		this.isInvulnerable = false;
		this.invulnerabilityDuration = 1000;

		// Creating the player element
		this.createElement(options.parentContainer);

		// Position/movement
		this.x = window.innerWidth / 2;
		this.y = window.innerHeight / 2;
		this.xvel = 0;
		this.yvel = 0;
		this.friction = 0.8;
		this.speed = 0.8;
		this.scaleX = 1;
		this.width = 40;
		this.height = 40;

		// Anim
		this.anim = {
			counter: 0,
			inc: Math.PI / 10,
			rightArm: {
				rot: 0,
				offsetX: 0,
				offsetY: 0,
			},
			leftArm: {
				rot: 0,
			},
			leftLeg: {
				rot: 0,
			},
			rightLeg: {
				rot: 0,
			},
			gun: {
				rot: 0,
			},
			lift: 0,
			knockback: 0,
		};

		// Shooting
		this.setupShooting();

		// Updating
		options.startUpdating(this.aim.bind(this));
		options.startUpdating(this.turn.bind(this));
		options.startUpdating(this.move.bind(this));
		options.startUpdating(this.animate.bind(this));
		options.startUpdating(this.boundaries.bind(this));
		options.startUpdating(this.updateStyles.bind(this));
	}

	setupShooting() {
		$(window).on("mousedown", this.handleShoot.bind(this));
	}

	handleShoot() {
		var barrel = $(".barrel");
		var x = barrel.offset().left;
		var y = barrel.offset().top;
		var dir = this.anim.rightArm.rot * this.scaleX;

		// Verifica que createBullet esté definido
		if (typeof this.createBullet === "function") {
			this.createBullet(x, y, dir);

			// Knockback animations
			this.anim.knockback = SHOOT_KNOCKBACK;

			// Pushback the player
			this.xvel += Math.cos(dir - Math.PI / 2) * 2.5;
			this.yvel += Math.sin(dir - Math.PI / 2) * 2.5;

			// Verifica que createSmoke esté definido
			if (typeof this.createSmoke === "function") {
				this.createSmoke(x, y, dir, 1);
			}
		}
	}

	// Creating / injecting the element
	createElement(parentContainer) {
		// The Markup
		this.el = $(`
<div class="player">
<div class="health-bar">
        <div class="health-fill"></div>
    </div>
<p class="txt">Piu, piu!</p>
<div class='hair'>
	<div class='hair-left'></div>
	<div class='hair-right'></div>
</div>
<div class='eye right'></div>
<div class='eye left'></div>
<div class='mouth'></div>
<div class='shirt'>
  <div class='neck'></div>
</div>
<div class='arm right'>
  <div class='sleeve'></div>
  <div class='gun'>
    <div class='grey'></div>
    <div class='barrel'></div>
  </div>
</div>
<div class='arm left'>
  <div class='sleeve'></div>
</div>
<div class='leg right'>
  <div class='pant'></div>
</div>
<div class='leg left'>
  <div class='pant'></div>
</div>
</div>
`);

		// Injection
		parentContainer.append(this.el);

		// Update dimensions
		this.width = this.el.outerWidth();
		this.height = this.el.outerHeight();
	}

	// Animate the player
	animate() {
		var isMoving =
			this.controls.isDown("right") ||
			this.controls.isDown("left") ||
			this.controls.isDown("up") ||
			this.controls.isDown("down")
				? true
				: false;

		// Running animation
		if (isMoving) {
			// Arms
			this.anim.leftArm.rot = Math.sin(this.anim.counter) / 2;

			// Legs
			this.anim.rightLeg.rot = Math.sin(this.anim.counter * 0.9) * 0.5;
			this.anim.leftLeg.rot = Math.sin(-this.anim.counter * 0.9) * 0.5;

			// Lift
			this.anim.lift = Math.sin(this.anim.counter) * 5;

			// Inc
			this.anim.counter += this.anim.inc;
		} else {
			// Resetting to idle state
			var leftArm = this.anim.leftArm.rot;
			var rightLeg = this.anim.rightLeg.rot;
			var leftLeg = this.anim.leftLeg.rot;
			var lift = this.anim.lift;
			var resetSpeed = 0.1;

			// Arms
			this.anim.leftArm.rot = leftArm - (leftArm - 0) * resetSpeed;

			// Legs
			this.anim.rightLeg.rot = rightLeg - (rightLeg - 0) * resetSpeed;
			this.anim.leftLeg.rot = leftLeg - (leftLeg - 0) * resetSpeed;

			// Lift
			this.anim.lift = lift - (lift - 0) * resetSpeed;
		}

		// Shooting
		var rightArmRot = this.anim.rightArm.rot;
		this.anim.rightArm.offsetX =
			Math.cos(rightArmRot - Math.PI / 2) * this.anim.knockback;
		this.anim.rightArm.offsetY =
			Math.sin(rightArmRot - Math.PI / 2) * this.anim.knockback;
		this.anim.gun.rot = -this.anim.knockback * 0.1;

		// Resetting the knockback
		this.anim.knockback =
			this.anim.knockback -
			(this.anim.knockback - 0) * SHOOT_KNOCKBACKRESET;
	}

	// Aiming at the mouse
	aim() {
		var rightArm = $(".player .arm.right");
		var armX = rightArm.offset().left;
		var armY = rightArm.offset().top;
		var angle = Math.atan2(mouse.y - armY, mouse.x - armX);
		this.anim.rightArm.rot = (angle - Math.PI / 2) * this.scaleX;
	}

	// Facing the mouse
	turn() {
		if (mouse.x < this.x) {
			this.scaleX = -1;
		} else {
			this.scaleX = 1;
		}
	}

	// Movement
	move() {
		// Physics
		this.x += this.xvel;
		this.y += this.yvel;
		this.xvel *= this.friction;
		this.yvel *= this.friction;

		// Keys
		if (this.controls.isDown("right")) {
			this.xvel += this.speed;
		} else if (this.controls.isDown("left")) {
			this.xvel -= this.speed;
		}
		if (this.controls.isDown("up")) {
			this.yvel -= this.speed;
		} else if (this.controls.isDown("down")) {
			this.yvel += this.speed;
		}
	}

	// Staying on screen
	boundaries() {
		if (this.x - this.width / 2 < 0) {
			this.x = this.width / 2 + 1;
			this.xvel = 0;
		} else if (this.x + this.width / 2 > window.innerWidth) {
			this.x = window.innerWidth - this.width / 2 - 1;
			this.xvel = 0;
		}
		if (this.y - this.height / 2 < 0) {
			this.y = this.height / 2 + 1;
			this.yvel = 0;
		} else if (this.y + this.height / 2 > window.innerHeight) {
			this.y = window.innerHeight - this.height / 2 - 1;
			this.yvel = 0;
		}
	}

	// Listen for mousepresses and shoot
	shoot() {
		$(window).on(
			"mousedown",
			function () {
				var barrel = $(".barrel");
				var x = barrel.offset().left;
				var y = barrel.offset().top;
				var dir = this.anim.rightArm.rot * this.scaleX;

				// Create the bullet
				this.createBullet(x, y, dir);

				// Knockback animations
				this.anim.knockback = SHOOT_KNOCKBACK;

				// Pushback the player
				this.xvel += Math.cos(dir - Math.PI / 2) * 2.5;
				this.yvel += Math.sin(dir - Math.PI / 2) * 2.5;

				// Smoke
				this.createSmoke(x, y, dir, 1);
			}.bind(this)
		);
	}

	takeDamage(amount) {
		// Si ya está muerto o es invulnerable, no hacer nada
		if (this.currentHealth <= 0 || this.isInvulnerable) return false;

		// Reducir salud
		this.currentHealth -= amount;

		// Actualizar barra de salud
		const healthPercent = Math.max(
			0,
			(this.currentHealth / this.maxHealth) * 100
		);
		this.el.find(".health-fill").css("width", `${healthPercent}%`);

		// Cambiar color según salud
		if (healthPercent < 30) {
			this.el.find(".health-fill").css("background", "#f44336");
		} else if (healthPercent < 60) {
			this.el.find(".health-fill").css("background", "#ff9800");
		}

		// Activar inmunidad temporal
		this.isInvulnerable = true;
		this.el.addClass("invulnerable");

		// Parpadeo durante la inmunidad
		const blinkInterval = setInterval(() => {
			this.el.toggleClass("blink");
		}, 100);

		setTimeout(() => {
			clearInterval(blinkInterval);
			this.isInvulnerable = false;
			this.el.removeClass("blink invulnerable");
		}, this.invulnerabilityDuration);

		// Verificar si el jugador murió
		if (this.currentHealth <= 0) {
			this.die();
		}

		return true; // Indica que el daño fue aplicado
	}

	die() {
		// Aquí puedes agregar animación de muerte
		console.log("¡Jugador muerto!");
		this.el.remove();
		// Puedes reiniciar el juego o mostrar game over
	}

	// Updating the styles
	updateStyles() {
		var rightArm = $(".player .arm.right");
		var leftArm = $(".player .arm.left");
		var rightLeg = $(".leg.right");
		var leftLeg = $(".leg.left");
		var gun = $(".gun");

		// Main el
		this.el.css({
			left: this.x,
			top: this.y,
			transform: `
translateX(-50%)
translateY(-${50 + this.anim.lift}%)
scaleX(${this.scaleX})
`,
		});

		// Arms
		rightArm.css({
			transform: `
translateX(${this.anim.rightArm.offsetX}px)
translateY(${this.anim.rightArm.offsetY}px)
rotate(${this.anim.rightArm.rot}rad)
`,
		});
		leftArm.css({
			transform: `rotate(${this.anim.leftArm.rot}rad)`,
		});

		// Legs
		rightLeg.css({
			transform: `
translateX(-50%)
rotate(${this.anim.rightLeg.rot}rad)
`,
		});
		leftLeg.css({
			transform: `
translateX(-50%)
rotate(${this.anim.leftLeg.rot}rad)
`,
		});

		// Gun
		gun.css({
			transform: `rotate(${this.anim.gun.rot}rad)`,
		});
	}
}