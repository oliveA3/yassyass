export const enemyTypes = {
	eagle: {
		name: "Águila de Ravenclaw",
		markup: `<div class="enemy eagle"></div>`,
		speed: 1.8,
		health: 2,
		damage: 2,
	},
	lion: {
		name: "León de Gryffindor",
		markup: `<div class="enemy lion"></div>`,
		speed: 1.2,
		health: 2,
		damage: 3,
	},
	snake: {
		name: "Serpiente de Slytherin",
		markup: `<div class="enemy snake"></div>`,
		speed: 2.0,
		health: 1,
		damage: 3,
	},
	badger: {
		name: "Tejón de Hufflepuff",
		markup: `<div class="enemy badger"></div>`,
		speed: 1.8,
		health: 3,
		damage: 2,
	},
};

export class EnemyHandler {
	constructor(options) {
		this.enemyTypes = enemyTypes;

		this.parentContainer = options.parentContainer;
		this.player = options.player;
		this.enemies = [];
		this.spawnTimer = 0;
		this.spawnInterval = 200;
		this.currentEnemyType = null;

		options.startUpdating(this.updateEnemies.bind(this));

		this.createEnemy = this.createEnemy.bind(this);
	}

	setEnemyType(type) {
		if (this.enemyTypes[type]) {
			this.currentEnemyType = type;
		} else {
			console.error(`Enemy not found: ${type}`);
		}
	}

	createEnemy(x, y, type) {
		const enemyData = this.enemyTypes[type];
		const newEnemy = {
			x: x,
			y: y,
			el: $(enemyData.markup),
			speed: enemyData.speed,
			health: enemyData.health,
			damage: enemyData.damage,
		};

		this.parentContainer.append(newEnemy.el);
		newEnemy.el.css({
			left: x,
			top: y,
		});

		this.enemies.push(newEnemy);
		return newEnemy;
	}

	updateEnemies() {
		if (!this.player || !this.player.el) return;

		for (let i = this.enemies.length - 1; i >= 0; i--) {
			const enemy = this.enemies[i];

			if (!enemy || !enemy.el || !enemy.el.offset) {
				this.enemies.splice(i, 1);
				continue;
			}

			const enemyPos = {
				x: enemy.el.offset().left + enemy.el.width() / 2,
				y: enemy.el.offset().top + enemy.el.height() / 2,
			};

			const playerPos = {
				x: this.player.el.offset().left + this.player.width / 2,
				y: this.player.el.offset().top + this.player.height / 2,
			};

			// Calcular distancia REAL (en píxeles)
			const dx = playerPos.x - enemyPos.x;
			const dy = playerPos.y - enemyPos.y;
			const dist = Math.sqrt(dx * dx + dy * dy);

			// Radio de colisión (ajusta según necesites)
			const playerRadius = this.player.width / 2;
			const enemyRadius = enemy.el.width() / 2;
			const collisionDistance = playerRadius + enemyRadius;

			// Solo aplicar daño si hay colisión REAL
			if (dist <= collisionDistance) {
				// Verificar que el jugador no sea invulnerable
				if (this.player.takeDamage && !this.player.isInvulnerable) {
					const damageApplied = this.player.takeDamage(1);

					if (damageApplied) {
						// Eliminar enemigo solo si el daño fue aplicado
						enemy.el.remove();
						this.enemies.splice(i, 1);

						// Pequeño retroceso para evitar daño continuo
						this.player.xvel += (dx / dist) * 5;
						this.player.yvel += (dy / dist) * 5;
					}
				}
				continue;
			}

			// Movimiento normal si no hay colisión
			if (dist > 0) {
				enemy.x += (dx / dist) * enemy.speed;
				enemy.y += (dy / dist) * enemy.speed;
			}

			enemy.el.css({
				left: enemy.x,
				top: enemy.y,
				/*transform: `translateX(-50%) translateY(-50%) rotate(${Math.atan2(
					dy,
					dx
				)}rad)`,*/
			});
		}
	}

	spawnEnemies() {
		if (!this.currentEnemyType) return;

		this.spawnTimer++;
		if (this.spawnTimer >= this.spawnInterval) {
			this.spawnTimer = 0;

			// Spawnear en los bordes de la pantalla
			let side = Math.floor(Math.random() * 4);
			let x, y;

			switch (side) {
				case 0: // arriba
					x = Math.random() * window.innerWidth;
					y = -50;
					break;
				case 1: // derecha
					x = window.innerWidth + 50;
					y = Math.random() * window.innerHeight;
					break;
				case 2: // abajo
					x = Math.random() * window.innerWidth;
					y = window.innerHeight + 50;
					break;
				case 3: // izquierda
					x = -50;
					y = Math.random() * window.innerHeight;
					break;
			}

			this.createEnemy(x, y, this.currentEnemyType);
		}
	}
}
